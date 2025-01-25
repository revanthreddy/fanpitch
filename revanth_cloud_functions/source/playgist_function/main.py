import functions_framework
from google import genai
from google.genai import types


def ask_vertex():
    client = genai.Client(
        vertexai=True,
        project="ethereal-temple-448819-n0",
        location="us-central1"
    )

    model = "gemini-2.0-flash-exp"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text("""how are you""")
            ]
        )
    ]
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
    result = ""
    for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
    ):
      result = result + chunk
    return "result"


@functions_framework.http
def handler(request):
    """Handles HTTP requests with multiple endpoints.

  Args:
      request (flask.Request): The request object.

  Returns:
      The response text.
  """
    if request.method == 'GET' and request.path == '/':
        return 'Welcome to the API'
    elif request.method == 'GET' and request.path == '/hello1':
        return ("Hello World!", 200, {})
    elif request.method == 'GET' and request.path == '/hello2':
        return ask_vertex()
    elif request.method == 'POST' and request.path == '/world':
        request_json = request.get_json(silent=True)
        name = request_json.get('name', 'World')
        return f'Hello {name} from /world'
    else:
        return 'default method', 200
