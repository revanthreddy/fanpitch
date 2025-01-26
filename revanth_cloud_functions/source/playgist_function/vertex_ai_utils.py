from vertexai.preview.generative_models import GenerativeModel, GenerationConfig
from vertexai.preview import generative_models
import vertexai
import json
from config import PROJECT_ID, LOCATION, MODEL_NAME
from bigquery_utils import run_query

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

system_instructions_big_query_expert_homeruns = [
    "You are a bigquery expert who can give me queries that I can run on my homeruns dataset",
    "The column headers of the dataset are play_id,title,ExitVelocity,HitDistance,LaunchAngle,video",
    "The person who hit the home run always starts with Playname homers in the title column",
    "Giancarlo Stanton homers",
    "query should always use this dataset FROM `ethereal-temple-448819-n0.homeruns_dataset.tb_homeruns`"
]

system_instructions_for_summary_homeruns_list  = [
    "You are an MLB analytics expert analyzing home run data.",
    "The input is a JSON array of home run events with fields: play_id, title, ExitVelocity, "
    "HitDistance, LaunchAngle, and video.",
    "Analyze the data to provide insights on the player's performance, focusing on available metrics.",
    "If ExitVelocity, HitDistance, or LaunchAngle are null or 0, mention the lack of data for those metrics.",
    "Extract the player's name and home run number from the title field.",
    "Provide a brief, insightful summary of all events listed",
    "Make the summary crisp, like around 200 chars"
    "See if you can include comparision of home runs if multiple events are present.",
    "Your analysis should be concise, data-driven, and relevant to baseball analytics.",
    "Dont print the json which was submitted"
]

system_instructions_for_language_translation =[
    "you are a language translator"
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

def vertex_translate(object_to_translate):
    pass

# print(summarize_player_homerun_insights(player="Miguel Montero"))
