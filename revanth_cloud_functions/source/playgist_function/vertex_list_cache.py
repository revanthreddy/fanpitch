import vertexai

from vertexai.preview import caching

# TODO(developer): Update & uncomment line below
# PROJECT_ID = "your-project-id"
vertexai.init(project="ethereal-temple-448819-n0",
        location="us-central1")

cache_list = caching.CachedContent.list()
# Access individual properties of a CachedContent object
for cached_content in cache_list:
    print(f"Cache '{cached_content.name}' for model '{cached_content.model_name}'")
    print(f"Last updated at: {cached_content.update_time}")
    print(f"Expires at: {cached_content.expire_time}")
    # Example response:
    # Cached content 'example-cache' for model '.../gemini-1.5-pro-001'
    # Last updated at: 2024-09-16T12:41:09.998635Z
    # Expires at: 2024-09-16T13:41:09.989729Z