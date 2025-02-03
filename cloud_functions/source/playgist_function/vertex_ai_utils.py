import json
import vertexai
from vertexai.preview.generative_models import GenerativeModel, GenerationConfig
from vertexai.preview import generative_models
from config import PROJECT_ID, LOCATION, MODEL_NAME, GAME_PK
from bigquery_utils import run_query, run_query_v2
from mlb_api_utils import top_performers, plays_diff
import config

vertexai.init(project=PROJECT_ID, location=LOCATION)


def get_safety_settings():
    harm_categories = [
        generative_models.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        generative_models.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        generative_models.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        generative_models.HarmCategory.HARM_CATEGORY_HARASSMENT
    ]
    return [
        generative_models.SafetySetting(
            category=category,
            threshold=generative_models.HarmBlockThreshold.BLOCK_NONE
        ) for category in harm_categories
    ]


def generate_content(model, content, generation_config, safety_settings):
    try:
        response = model.generate_content(
            content,
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Error generating content: {e}")
        raise


def create_model(system_instruction):
    return GenerativeModel(model_name=MODEL_NAME, system_instruction=system_instruction)


def get_generation_config(temperature=1, top_p=0.95, max_tokens=8192, response_schema=None):
    return GenerationConfig(
        temperature=temperature,
        top_p=top_p,
        max_output_tokens=max_tokens,
        stop_sequences=None,
        response_mime_type="application/json",
        response_schema=response_schema
    )


def summarize_home_run_list(homerun_list):
    model = create_model(config.system_instructions_for_summary_homeruns_list)
    content = json.dumps(homerun_list)
    generation_config = get_generation_config(response_schema={
        "type": "object",
        "properties": {"summary": {"type": "string"}},
        "required": ["summary"]
    })
    result = generate_content(model, content, generation_config, get_safety_settings())
    return result["summary"]


def get_homerun_list_via_bigquery(player):
    model = create_model(config.system_instructions_big_query_expert_homeruns)
    content = f"list 5 homeruns hit by {player}"
    generation_config = get_generation_config(response_schema={
        "type": "object",
        "properties": {
            "query": {"type": "string"},
            "explanation": {"type": "string"}
        },
        "required": ["query", "explanation"]
    })
    result = generate_content(model, content, generation_config, get_safety_settings())
    return run_query(result["query"])


def summarize_player_homerun_insights(player):
    try:
        homeruns = get_homerun_list_via_bigquery(player)
        return {"insights": summarize_home_run_list(homeruns)}, 200
    except Exception as e:
        return {"response": str(e)}, 500


def get_me_something_interesting(conversation, diff_plays=None):
    input_data = {
        "chat": conversation["chat"],
        "top_performers_start_window": top_performers(GAME_PK, timecode=conversation["start"]),
        "top_performers_end_window": top_performers(GAME_PK, timecode=conversation["end"]),
        "latest_plays": diff_plays if diff_plays else plays_diff(GAME_PK, conversation["start"], conversation['end'])
    }
    model = create_model(config.system_instructions_for_interesting_v2)
    generation_config = get_generation_config(temperature=2, response_schema={
        "type": "object",
        "properties": {"summary": {"type": "string"}},
        "required": ["summary"]
    })
    return generate_content(model, json.dumps(input_data), generation_config, get_safety_settings()), 200


def translate_text(object_to_translate):
    system_instructions = [
        "you are a language translator",
        "just translate the text written",
        f'to {object_to_translate["translate_to"]}'
    ]
    model = create_model(system_instructions)
    generation_config = get_generation_config(response_schema={
        "type": "object",
        "properties": {"translated_text": {"type": "string"}},
        "required": ["translated_text"]
    })
    result = generate_content(model, object_to_translate["text"], generation_config, get_safety_settings())
    return {"translated_text": result["translated_text"]}, 200


def build_query_for_the_ask(ask):
    model = create_model(config.system_instructions_big_query_expert_ask)
    generation_config = get_generation_config(response_schema={
        "type": "object",
        "properties": {
            "query": {"type": "string"},
            "type": {"type": "string"},
            "explanation": {"type": "string"},
            "clip": {"type": "boolean"}
        },
        "required": ["query", "explanation", "type"]
    })
    return generate_content(model, ask, generation_config, get_safety_settings())


def summarize_ask_query_results(ask):
    try:
        query_object = build_query_for_the_ask(ask)
        query_results, explanation = run_query_v2(query_object["query"], query_object["type"]), query_object[
            "explanation"]
        model = create_model(config.system_instructions_for_ask_results_summary)
        combined_data = [query_results, {"ask": ask}]
        generation_config = get_generation_config(temperature=1.5, response_schema={
            "type": "object",
            "properties": {"summary": {"type": "string"}},
            "required": ["summary"]
        })
        result = generate_content(model, json.dumps(combined_data), generation_config, get_safety_settings())
        summary = result["summary"]
        response = {"summary": summary}
        if query_object.get("clip", False):
            response["clip"] = query_results[0]["video"]
        return response, 200
    except Exception as e:
        raise
