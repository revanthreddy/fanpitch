from vertexai.preview.generative_models import GenerativeModel, GenerationConfig
from vertexai.preview import generative_models
import vertexai
import json
from config import PROJECT_ID, LOCATION, MODEL_NAME
from bigquery_utils import run_query, run_query_v2
import config
from config import system_instructions_big_query_expert_homeruns
from config import system_instructions_big_query_expert_ask
from config import system_instructions_for_summary_homeruns_list
from config import system_instructions_for_interesting
from config import system_instructions_for_ask_results_summary
from config import system_instructions_for_interesting_v2
from config import GAME_PK
from mlb_api_utils import plays, top_performers, plays_diff

vertexai.init(project=PROJECT_ID, location=LOCATION)

genai_safety_settings = [
    generative_models.SafetySetting(
        category=generative_models.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold=generative_models.HarmBlockThreshold.BLOCK_NONE
    ),
    generative_models.SafetySetting(
        category=generative_models.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold=generative_models.HarmBlockThreshold.BLOCK_NONE
    ),
    generative_models.SafetySetting(
        category=generative_models.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold=generative_models.HarmBlockThreshold.BLOCK_NONE
    ),
    generative_models.SafetySetting(
        category=generative_models.HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold=generative_models.HarmBlockThreshold.BLOCK_NONE
    )
]


def summarize_home_run_list(homerun_list):
    model = GenerativeModel(model_name=MODEL_NAME,
                            system_instruction=system_instructions_for_summary_homeruns_list)

    content = json.dumps(homerun_list)

    generation_config = GenerationConfig(
        temperature=1,
        top_p=0.95,
        max_output_tokens=8192,
        stop_sequences=None,
        response_mime_type="application/json",
        response_schema={
            "type": "object",
            "properties": {
                "summary": {"type": "string"}
            },
            "required": ["summary"]
        }
    )

    safety_settings = genai_safety_settings

    try:
        response = model.generate_content(
            content,
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        return json.loads(response.text)["summary"]
    except Exception as e:
        print(e)
        raise e


def get_homerun_list_via_bigquery(player):
    model = GenerativeModel(model_name=MODEL_NAME,
                            system_instruction=system_instructions_big_query_expert_homeruns)

    content = f"list 5 homeruns hit by {player}"

    generation_config = GenerationConfig(
        temperature=1,
        top_p=0.95,
        max_output_tokens=8192,
        stop_sequences=None,
        response_mime_type="application/json",
        response_schema={
            "type": "object",
            "properties": {
                "query": {"type": "string"},
                "explanation": {"type": "string"}
            },
            "required": ["query", "explanation"]
        }
    )

    safety_settings = genai_safety_settings

    try:
        response = model.generate_content(
            content,
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        return run_query(json.loads(response.text)["query"])
    except Exception as e:
        raise e


def summarize_player_homerun_insights(player):
    try:
        homeruns = get_homerun_list_via_bigquery(player)
        return {"insights": summarize_home_run_list(homerun_list=homeruns)}, 200
    except Exception as e:
        return {"response": str(e)}, 500


def get_me_something_interesting(conversation):
    input_to_the_model = {
        "chat": conversation["chat"],
        "top_performers_start_window": top_performers(GAME_PK, timecode=conversation["start"]),
        "top_performers_end_window": top_performers(GAME_PK, timecode=conversation["end"])
    }

    model = GenerativeModel(model_name=MODEL_NAME,
                            system_instruction=system_instructions_for_interesting_v2)

    generation_config = GenerationConfig(
        temperature=2,
        top_p=0.95,
        max_output_tokens=8192,
        stop_sequences=None,
        response_mime_type="application/json",
        response_schema={
            "type": "object",
            "properties": {
                "summary": {"type": "string"}
            },
            "required": ["summary"]
        }
    )

    safety_settings = genai_safety_settings

    try:
        response = model.generate_content(
            json.dumps(input_to_the_model),
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        response = json.loads(response.text)
        return response, 200
    except Exception as e:
        raise e


def translate_text(object_to_translate):
    system_instructions_for_language_translation = ["you are a language translator", "just translate the text written",
                                                    f' to {object_to_translate["translate_to"]}']

    model = GenerativeModel(model_name=MODEL_NAME,
                            system_instruction=system_instructions_for_language_translation)

    generation_config = GenerationConfig(
        temperature=1,
        top_p=0.95,
        max_output_tokens=8192,
        stop_sequences=None,
        response_mime_type="application/json",
        response_schema={
            "type": "object",
            "properties": {
                "translated_text": {"type": "string"}
            },
            "required": ["translated_text"]
        }
    )

    safety_settings = genai_safety_settings

    try:
        response = model.generate_content(
            object_to_translate["text"],
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        translated_text = json.loads(response.text)["translated_text"]
        return {"translated_text": translated_text}, 200
    except Exception as e:
        raise e


def build_query_for_the_ask(ask):
    model = GenerativeModel(model_name=MODEL_NAME,
                            system_instruction=system_instructions_big_query_expert_ask)

    content = ask

    generation_config = GenerationConfig(
        temperature=1,
        top_p=0.95,
        max_output_tokens=8192,
        stop_sequences=None,
        response_mime_type="application/json",
        response_schema={
            "type": "object",
            "properties": {
                "query": {"type": "string"},
                "type": {"type": "string"},
                "explanation": {"type": "string"},
                "clip": {"type": "boolean"}
            },
            "required": ["query", "explanation", "type"]
        }
    )

    safety_settings = genai_safety_settings

    response = model.generate_content(
        content,
        generation_config=generation_config,
        safety_settings=safety_settings
    )
    query_object = json.loads(response.text)
    # print(query_object["query"])
    # return run_query_v2(query_object["query"], query_object["type"]), query_object["explanation"]
    return query_object


def summarize_ask_query_results(ask):
    try:
        query_object = build_query_for_the_ask(ask)
        query_results, explanation = run_query_v2(query_object["query"], query_object["type"]), query_object[
            "explanation"]
        print(query_object, query_results, explanation)
        model = GenerativeModel(model_name=MODEL_NAME,
                                system_instruction=system_instructions_for_ask_results_summary)
        combined_data = [query_results, {"ask": ask}]
        # print(combined_data)
        content = json.dumps(combined_data)

        generation_config = GenerationConfig(
            temperature=1.5,
            top_p=0.95,
            max_output_tokens=8192,
            stop_sequences=None,
            response_mime_type="application/json",
            response_schema={
                "type": "object",
                "properties": {
                    "summary": {"type": "string"}
                },
                "required": ["summary"]
            }
        )

        safety_settings = genai_safety_settings

        response = model.generate_content(
            content,
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        summary = json.loads(response.text)["summary"]
        result = {"summary": summary}
        if "clip" in query_object and query_object["clip"] is not False:
            result["clip"] = query_results[0]["video"]
        return result, 200
    except Exception as e:
        raise e

    pass
