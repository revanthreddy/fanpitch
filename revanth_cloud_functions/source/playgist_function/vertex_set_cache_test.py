import vertexai
import datetime

from vertexai.generative_models import Part
from vertexai.preview import caching

# TODO(developer): Update and un-comment below line
# PROJECT_ID = "your-project-id"

vertexai.init(project="ethereal-temple-448819-n0",
        location="us-central1")

system_instruction = """
You are baseball researcher. You always stick to the facts in the sources provided, and never make up new facts.
Now look at these MLB homeruns from 2016, 2017 and 2024 seasons and answer the following questions.
"""

contents = [
    # Part.from_uri(
    #     "gs://gcp-mlb-hackathon-2025/datasets/2024-postseason-mlb-homeruns.csv",
    #     mime_type="text/csv",
    # ),
    # Part.from_uri(
    #     "gs://gcp-mlb-hackathon-2025/datasets/2016-mlb-homeruns.csv",
    #     mime_type="text/csv",
    # ),
    Part.from_uri(
        "gs://gcp-mlb-hackathon-2025/datasets/2017-mlb-homeruns.csv",
        mime_type="text/csv",
    ),
]

cached_content = caching.CachedContent.create(
    model_name="gemini-1.5-pro-002",
    system_instruction=system_instruction,
    contents=contents,
    ttl=datetime.timedelta(minutes=60),
    display_name="mlb-homeruns-cache",
)

print(cached_content.name)
# Example response:
# 1234567890