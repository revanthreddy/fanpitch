from google import genai
from google.generativeai import caching
from google.genai import types
import base64
import datetime
import time


def generate():
    client = genai.Client(
        vertexai=True,
        project="ethereal-temple-448819-n0",
        location="us-central1"
    )



    cache = caching.CachedContent.create(
        model = "gemini-2.0-flash-exp",
        display_name='sherlock jr movie',  # used to identify the cache
        system_instruction=(
            'You are an expert video analyzer, and your job is to answer '
            'the user\'s query based on the video file you have access to.'
        ),
        contents = [
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text("""how are you""")
                    ]
                )
            ],
        ttl=datetime.timedelta(minutes=5),
    )

    generate_content_config = types.GenerateContentConfig(
        temperature=1,
        top_p=0.95,
        max_output_tokens=8192,
        response_modalities=["TEXT"],
        safety_settings=[types.SafetySetting(
            category="HARM_CATEGORY_HATE_SPEECH",
            threshold="OFF"
        ), types.SafetySetting(
            category="HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold="OFF"
        ), types.SafetySetting(
            category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold="OFF"
        ), types.SafetySetting(
            category="HARM_CATEGORY_HARASSMENT",
            threshold="OFF"
        )],
        system_instruction=[types.Part.from_text("""you are an mlb expert""")],
    )
    # Construct a GenerativeModel which uses the created cache.
    model = genai.GenerativeModel.from_cached_content(cached_content=cache)
    response = model.generate_content([(
        'Introduce different characters in the movie by describing '
        'their personality, looks, and names. Also list the timestamps '
        'they were introduced for the first time.')])

    print(response.usage_metadata)
    # for chunk in client.models.generate_content_stream(
    #         model=model,
    #         contents=contents,
    #         config=generate_content_config,
    # ):
    #     print(chunk, end="")


generate()



# from google.cloud import storage
#
# def list_blobs(bucket_name):
#     """Lists all blobs in the bucket."""
#     storage_client = storage.Client()
#     bucket = storage_client.bucket(bucket_name)
#
#     blobs = bucket.list_blobs()
#
#     for blob in blobs:
#         print(blob.name)
#
# if __name__ == '__main__':
#     bucket_name = "gcf-v2-sources-885292264568-us-central1"  # Replace with your actual bucket name
#     list_blobs(bucket_name)