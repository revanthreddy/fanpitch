# FanPitch: AI-Powered Fantasy Baseball Insights

Supercharge your fantasy league with FanPitch! This AI assistant analyzes live games, stats, group conversations, and translations – all in your group chat. Ask FanPitch anything baseball.


## Table of Contents

* [Introduction](#introduction)
* [Features](#features)
* [Technologies](#technologies)
* [Installation](#installation)
* [Usage](#usage)
* [Future Roadmap](#future-roadmap)
* [Team](#team)

## Introduction

We're passionate fantasy baseball players who've always felt frustrated by the limitations of chats provided by traditional fantasy leagues. Scattered stats, endless scrolling, and the difficulty of incorporating diverse perspectives hampered the fun and engagement. We envisioned a tool that could centralize, analyze, and enhance the entire fantasy experience for the user without ever leaving the chat.

## What it does
FanPitch is an AI-powered assistant integrated directly into your fantasy league's group chat. It dynamically analyzes conversations, offering:

* **Real-time insights:** Instant access to relevant stats, news, and highlight clips based on players mentioned in the chat.
* **Multilingual message translation support:** Break down language barriers within your league with seamless real-time translation.
* **Pitch a question:** Gain insights into baseball stats by asking FanPitch questions relevant to the game

## How we built each feature
FanPitch leverages a combination of technologies:

- Real-time Insights: We take user chats and live game events via the MLB stats API to generate relevant conversational highlights and analysis as the game progresses. We also summarize user interactions and callout chat participation. Currently the application has access to the [2024 MLB home runs dataset](https://storage.googleapis.com/gcp-mlb-hackathon-2025/datasets/2024-mlb-homeruns.csv) and the MLB stats API.
- Pitch a question: The user's natural language input is sent to a custom-trained AI model hosted on Vertex AI. This model intelligently interprets the question and translates it into a structured query suitable for BigQuery. This is the core of our solution, allowing users to access complex data without needing to know SQL or understand database schemas. An AI model uses this data to craft a clear, concise, and contextually aware response.
- Chat Integration: The AI-generated response is delivered directly back into the fantasy league chat, providing users with instant insights without ever leaving the conversation. This creates a truly integrated and streamlined experience.

## Technologies

* **Vertex AI (featuring Gemini models):**  Powers the natural language understanding and response generation.
* **[API GW](https://cloud.google.com/api-gateway/docs/about-api-gateway) and [Cloud Run functions](https://cloud.google.com/functions#key-features):**  Powers the backend by handling API requests and executing the natural language understanding and response generation logic.
* **[BigQuery](https://cloud.google.com/bigquery?hl=en):** Stores and manages our baseball datasets.
* **[Firebase](https://firebase.google.com):** UI hosting.
* **React, Tailwind and vite:** UI.
* **MLB Stats API:** Provides [live game (example)](https://statsapi.mlb.com/api/v1.1/game/746011/feed/live) data  and top performer statistics.

## Installation

*(Note:  These instructions are for development setup.  End-users will interact with FanPitch through their existing chat platform once it is integrated.)*
- Clone the repository: `git clone https://github.com/[your-username]/fanpitch.git`

### UI setup
1. Copy your Firebase project config to [config.ts](./config.ts)
2. In this directory, run `npm install`
3. In this directory, run `npm run dev`

### Backend setup
1. Set up BigQuery datasets: 
   1. Create a google cloud storage in your GCP project
   2. Download the [2024 MLB home runs dataset](https://storage.googleapis.com/gcp-mlb-hackathon-2025/datasets/2024-mlb-homeruns.csv) and upload it to your google cloud storage bucket
   3. Upload the CSV to a BigQuery by following these [instructions](https://cloud.google.com/bigquery/docs/loading-data-cloud-storage-csv) 
2. Fill the [config.py](./cloud_functions/source/playgist_function/config.py) with your google PROJECT_ID, LOCATION, HOMERUN_DATASET_NAME & HOMERUN_TABLE_NAME
3. From the root of this directory, run `sh cloud_functions/run.sh`. This will deploy the API gateway and cloud run functions into your google project and generate and endpoint that will be used by the UI for the backend interaction

## Usage

The application is available at https://ethereal-temple-448819-n0.web.app. The application currently loads a live simulation of a fantasy league chat running on a particular game at a particular time. 
It simulates user interaction but makes calls to the backend to generate contextually aware real-time responses. We support translation and pitch-a-question via Shift+enter. 
The responses to pitch-a-question are limited to homerun data from the 2024 season. 
For example, you can try the below prompts: 
- "Can you show me a clip of the fastest home run in 2024?"
- "What was the longest homer this year?"
- "Give me the 5 longest home runs"
- "Give me the top 5 home runs where the exit velocity was less than 100 mph, but the distance was more than 200"
- 
## Future Roadmap
* **Catch Me Up:** This feature would summarize the last few minutes of the conversation while the user was in an idle state or away from the chat.
* **Audio Podcast Generation:** The one feature on our roadmap that we are excited about is the ability to generate audio podcasts of chat logs. We envision this as a way for users to relive the excitement of close games, or hilarious banter.
* **Data Enrichment:** We recognize that the quality of FanPitch's insights is directly tied to the data that is being used. Therefore, we plan to incorporate more diverse and granular baseball statistics, player information, and even external data sources (like news articles, expert predictions, or live commentary) to empower our application and enhance the responses.
* **Improved Model Training:**  Continuously refine and retrain our AI models to optimize performance and accuracy.

## Team

* [Revanth](https://github.com/revanthreddy/)
* [Neel Shah](https://github.com/recreationalcode)
* [Shubham Thakkar](https://github.com/SThakkar14)