from google.cloud import bigquery
import json

def format_rows_for_ai(rows):
    formatted_data = []
    for row in rows:
        formatted_row = {
            "play_id": row[0],
            "title": row[1],
            "ExitVelocity": row[2],
            "HitDistance": row[3],
            "LaunchAngle": row[4],
            "video": row[5]
        }
        formatted_data.append(formatted_row)

    return json.dumps(formatted_data, indent=2)
# Construct a BigQuery client object.
client = bigquery.Client()

query = """
    SELECT *
    FROM `ethereal-temple-448819-n0.homeruns_dataset.tb_homeruns`
    LIMIT 2
"""
rows = client.query_and_wait(query)  # Make an API request.

formatted_output = format_rows_for_ai(rows)
print(formatted_output)
#
# for row in rows:
#     # Row values can be accessed by field name or index.
#     print(str(row))