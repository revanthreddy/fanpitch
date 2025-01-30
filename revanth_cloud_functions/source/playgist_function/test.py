from vertex_ai_utils import summarize_player_homerun_insights
from vertex_ai_utils import translate_text
from vertex_ai_utils import get_me_something_interesting
from vertex_ai_utils import build_query_for_the_ask
from vertex_ai_utils import summarize_ask_query_results


# print(summarize_player_homerun_insights(player="Miguel Montero"))
# print(translate_text({
#     "text": "hello",
#     "translate_to": "Japanese"
# }))
# conversation= {
#   "chat": [
#     {
#       "id": "7",
#       "text": "GRAND SLAM! Biggio YOU BEAUTIFUL MAN! 🎉",
#       "sender": { "id": "user3", "name": "John", "avatar": "🏆" }
#     },
#     {
#       "id": "8",
#       "text": "Well, there goes my pitching stats for the week 😭",
#       "sender": { "id": "user4", "name": "Alex", "avatar": "🔥", "isUser": True }
#     },
#     {
#       "id": "9",
#       "text": "That's baseball for ya! Anyone watching the Dodgers game? Yandy Diaz is heating up 👀",
#       "sender": { "id": "user1", "name": "Mike", "avatar": "🎯" }
#     }
#   ],
#   "events": [
#     {
#       "result": {
#         "event": "Groundout",
#         "eventType": "field_out",
#         "description": "Cavan Biggio grounds out, second baseman Isaac Paredes to first baseman Yandy Diaz.",
#         "isOut": True
#       },
#       "about": {
#         "startTime": "2023-09-23T20:15:33.864Z",
#         "endTime": "2023-09-23T20:16:19.204Z",
#         "isComplete": True
#       }
#     },
#     {
#       "result": {
#         "event": "Home Run",
#         "eventType": "home_run",
#         "description": "Yandy Diaz homers (21) on a fly ball to left center field.",
#         "isOut": True
#       },
#       "about": {
#         "startTime": "2023-09-23T20:18:20.687Z",
#         "endTime": "2023-09-23T20:20:51.973Z",
#         "isComplete": True
#       }
#     }
#   ]
# }
#
# print(get_me_something_interesting(conversation=conversation))


# print(summarize_ask_query_results("tell  me about  top 5, 100 yards homers"))

print(summarize_ask_query_results("how many home runs did Jesús Sánchez hit?"))