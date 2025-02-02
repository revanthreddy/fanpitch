import vertexai

from vertexai.preview import caching

# TODO(developer): Update and un-comment below lines
# PROJECT_ID = "your-project-id"
cache_id = "5176047744778764288"

vertexai.init(project="ethereal-temple-448819-n0",
        location="us-central1")
cached_content = caching.CachedContent(cached_content_name=cache_id)
cached_content.delete()