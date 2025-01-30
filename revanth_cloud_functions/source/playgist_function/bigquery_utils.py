from google.cloud import bigquery
import json

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
