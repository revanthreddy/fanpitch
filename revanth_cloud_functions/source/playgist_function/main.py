import functions_framework

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
    return 'Hello from /hello1'
  elif request.method == 'GET' and request.path == '/hello2':
    return 'Hello from /hello2'
  elif request.method == 'POST' and request.path == '/world':
    request_json = request.get_json(silent=True)
    name = request_json.get('name', 'World')
    return f'Hello {name} from /world'
  else:
    return 'Method or path not allowed', 405