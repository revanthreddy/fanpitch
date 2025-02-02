import vertexai

from vertexai.preview.generative_models import GenerativeModel
from vertexai.preview import caching

# TODO(developer): Update and un-comment below lines
# PROJECT_ID = "your-project-id"
cache_id = "5176047744778764288"

vertexai.init(project="ethereal-temple-448819-n0",
        location="us-central1")


cached_content = caching.CachedContent(cached_content_name=cache_id)

model = GenerativeModel.from_cached_content(cached_content=cached_content)

# response = model.generate_content("What was Charlie Blackmon's 2017 home run count")
response = model.generate_content("What is the full form of MLB ?")

print(response.text)
# Example response:
# The provided text is about a new family of multimodal models called Gemini, developed by Google.
# ...