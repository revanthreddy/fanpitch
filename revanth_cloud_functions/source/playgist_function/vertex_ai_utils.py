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

system_instructions_for_summary_homeruns_list = [
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

system_instructions_for_interesting = [
    "You are an expert baseball strategic analyst. Your job is to provide realtime strategic insights based on live "
    "events provided to you. The insights should be relevant to a fantasy MLB group chat conversation that will also "
    "be provided to you. Your response should be significant, appropriate, and concise (under 200 characters).",
    "You will be give a json body that has two elements 'chat' and 'events'",
    "chat is list of json items that fields id, text and user",
    "events is a list of plays and its results for a particular time window",
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
    model = GenerativeModel(model_name=MODEL_NAME,
                            system_instruction=system_instructions_for_interesting)

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
            json.dumps(conversation),
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

# print(summarize_player_homerun_insights(player="Miguel Montero"))
# print(translate_text({
#     "text": "hello",
#     "translate_to": "English"
# }))
# conversation= {
#   "chat": [
#     {
#       "id": "7",
#       "text": "GRAND SLAM! Biggio YOU BEAUTIFUL MAN! 🎉",
#       "sender": { "id": "user3", "name": "John", "avatar": "🏆" }
#     },
#     {
#       "id": "8",
#       "text": "Well, there goes my pitching stats for the week 😭",
#       "sender": { "id": "user4", "name": "Alex", "avatar": "🔥", "isUser": True }
#     },
#     {
#       "id": "9",
#       "text": "That's baseball for ya! Anyone watching the Dodgers game? Yandy Diaz is heating up 👀",
#       "sender": { "id": "user1", "name": "Mike", "avatar": "🎯" }
#     }
#   ],
#   "events": [
#     {
#       "result": {
#         "event": "Groundout",
#         "eventType": "field_out",
#         "description": "Cavan Biggio grounds out, second baseman Isaac Paredes to first baseman Yandy Diaz.",
#         "isOut": True
#       },
#       "about": {
#         "startTime": "2023-09-23T20:15:33.864Z",
#         "endTime": "2023-09-23T20:16:19.204Z",
#         "isComplete": True
#       }
#     },
#     {
#       "result": {
#         "event": "Home Run",
#         "eventType": "home_run",
#         "description": "Yandy Diaz homers (21) on a fly ball to left center field.",
#         "isOut": True
#       },
#       "about": {
#         "startTime": "2023-09-23T20:18:20.687Z",
#         "endTime": "2023-09-23T20:20:51.973Z",
#         "isComplete": True
#       }
#     }
#   ]
# }
#
# print(get_me_something_interesting(conversation=conversation))