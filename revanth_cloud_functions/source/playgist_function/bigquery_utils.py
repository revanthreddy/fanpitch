from google.cloud import bigquery
import json

from revanth_cloud_functions.source.playgist_function.config import HOMERUN_DATASET_PATH

big_query_client = bigquery.Client()


def format_rows_from_bigquery_for_ai(rows):
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
    return formatted_data


def format_rows_from_bigquery_for_ai_v2(rows):
    formatted_data = []

    # Get the schema to extract column names
    schema = rows.schema
    column_names = [field.name for field in schema]

    for row in rows:
        formatted_row = {column_names[i]: value for i, value in enumerate(row)}
        formatted_data.append(formatted_row)

    return formatted_data


def run_query(query):
    rows = big_query_client.query_and_wait(query)
    return format_rows_from_bigquery_for_ai(rows=rows)


def run_query_v2(query, type):
    rows = big_query_client.query_and_wait(query)
    return format_rows_from_bigquery_for_ai_v2(rows=rows)


def videos_urls_for_plays(plays):
    home_run_descriptions = [play['result']['description'] for play in plays if
                             'result' in play and 'eventType' in play['result'] and play['result'][
                                 'eventType'] == 'home_run']
    if len(home_run_descriptions) == 0:
        return []
    query = f'SELECT DISTINCT(video) FROM {HOMERUN_DATASET_PATH} WHERE title IN (\'{'\',\''.join(home_run_descriptions)}\');'
    rows = big_query_client.query_and_wait(query)
