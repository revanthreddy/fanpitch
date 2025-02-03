import functions_framework
from flask import make_response, jsonify

from bigquery_utils import videos_urls_for_plays
from vertex_ai_utils import summarize_player_homerun_insights
from vertex_ai_utils import translate_text
from vertex_ai_utils import get_me_something_interesting
from vertex_ai_utils import summarize_ask_query_results
from urllib.parse import unquote
from config import ALLOWED_LANGUAGES, GAME_PK
from mlb_api_utils import plays_diff

@functions_framework.http
def handler(request):
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return '', 204, headers

    headers = {'Access-Control-Allow-Origin': '*'}

    if request.method == 'GET' and request.path == '/':
        return make_response('Welcome to the API', 200, headers)
    elif request.method == 'GET' and request.path == '/playerinsights':
        player = request.args.get('player')
        if player is None:
            return make_response(jsonify({"error": "Missing 'player' query parameter"}), 400, headers)
        # URL decode the content
        player = unquote(player)
        response, status_code = summarize_player_homerun_insights(player=player)
        return make_response(jsonify(response), status_code, headers)
    elif request.method == 'POST' and request.path == '/translate':
        if not request.is_json:
            return make_response(jsonify({"error": "Request must be JSON"}), 400, headers)

        data = request.get_json()
        text = data.get('text')
        translate_to = data.get('translate_to')

        if not text or not translate_to:
            return make_response(jsonify({"error": "Missing 'text' or 'translate_to' in request body"}), 400, headers)

        if translate_to not in ALLOWED_LANGUAGES:
            return make_response(jsonify({"error": f"'translate_to' must be one of {', '.join(ALLOWED_LANGUAGES)}"}),
                                 400, headers)
        response, status_code = translate_text(object_to_translate={"text": text, "translate_to": translate_to})
        return make_response(jsonify(response), 200, headers)

    elif request.method == 'POST' and request.path == '/summarize':
        request_json = request.get_json(silent=True)
        name = request_json.get('name', 'World')
        return make_response(f'Hello {name} from /world', 200, headers)

    elif request.method == 'POST' and request.path == '/interesting':
        request_json = request.get_json(silent=True)
        if not request.is_json:
            return make_response(jsonify({"error": "Request must be JSON"}), 400, headers)

        if "chat" not in request_json or "start" not in request_json or  "end" not in request_json:
            return make_response(jsonify({"error": "Missing required fields: 'chat' , 'start' and 'end'"}), 400, headers)

        # Use in get_me_something_interesting. Saves an extra network call
        diff_plays = plays_diff(GAME_PK, request_json['start'], request_json['end'])

        response, status = get_me_something_interesting(request_json, diff_plays)

        video_urls = videos_urls_for_plays(diff_plays)
        if len(video_urls) > 0:
            response['videos'] = video_urls

        return make_response(response, status, headers)

    elif request.method == 'POST' and request.path == '/ask':
        request_json = request.get_json(silent=True)
        if not request.is_json:
            return make_response(jsonify({"error": "Request must be JSON"}), 400, headers)

        if "ask" not in request_json:
            return make_response(jsonify({"error": "Missing required fields: 'ask'"}), 400, headers)

        response, status = summarize_ask_query_results(request_json["ask"])
        return make_response(response, status, headers)

    else:
        return make_response('default method', 200, headers)
