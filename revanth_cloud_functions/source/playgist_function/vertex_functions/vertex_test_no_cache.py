from vertexai.preview.generative_models import GenerativeModel, GenerationConfig
from vertexai.preview import generative_models
import vertexai

# Initialize Vertex AI
vertexai.init(project="ethereal-temple-448819-n0", location="us-central1")

# Set up the model
model_name = "gemini-1.5-pro"  # Use the appropriate model name
model = GenerativeModel(model_name)

# Prepare the content
content = "how are yo"

# Configure generation settings
generation_config = GenerationConfig(
    temperature=1,
    top_p=0.95,
    max_output_tokens=8192,
    stop_sequences=None
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
except Exception as e:
    print(f"An error occurred: {str(e)}")
