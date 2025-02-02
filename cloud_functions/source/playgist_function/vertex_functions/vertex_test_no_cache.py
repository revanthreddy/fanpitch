from vertexai.preview.generative_models import GenerativeModel, GenerationConfig
from vertexai.preview import generative_models
import vertexai
import json
from google.cloud import bigquery


big_query_client = bigquery.Client()
def format_rows_from_bigquery_for_ai(rows):
    formatted_data = []
    for row in rows:
        formatted_row = {
            "play_id": row[0],
            "title": row[1],
            "ExitVelocity": row[2],
            "HitDistance": row[3],
            "LaunchAngle": row[4],
            "video": row[5]
        }
        formatted_data.append(formatted_row)
    return formatted_data


def run_query(query):
    rows = big_query_client.query_and_wait(query)  # Make an API request.
    return format_rows_from_bigquery_for_ai(rows=rows)

# Initialize Vertex AI
vertexai.init(project="ethereal-temple-448819-n0", location="us-central1")

# Set up the model
model_name = "gemini-2.0-flash-exp"  # Use the appropriate model name
model = GenerativeModel(model_name=model_name,
system_instruction=[
        "You are a bigquery expert who can give me queries that I can run on my homeruns dataset",
        "The column headers of the dataset are play_id,title,ExitVelocity,HitDistance,LaunchAngle,video",
        "The person who hit the home run always starts with Playname homers in the title column",
        "Giancarlo Stanton homers",
        "query should always use this dataset FROM `ethereal-temple-448819-n0.homeruns_dataset.tb_homeruns`"
    ],)

    # Prepare the content
content = "list two homeruns hit by Jay Bruce"

# Configure generation settings
generation_config = GenerationConfig(
    temperature=1,
    top_p=0.95,
    max_output_tokens=8192,
    stop_sequences=None,
    response_mime_type="application/json",
    response_schema = {
        "type": "object",
        "properties": {
            "query": {"type": "string"},
            "explanation": {"type": "string"}
        },
        "required": ["query", "explanation"]
    }
)

# Set up safety settings
safety_settings = [
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

# Generate content
try:
    response = model.generate_content(
        content,
        generation_config=generation_config,
        safety_settings=safety_settings
    )
    print(response.text)
    print(run_query(json.loads(response.text)["query"]))

except Exception as e:
    print(f"An error occurred: {str(e)}")
