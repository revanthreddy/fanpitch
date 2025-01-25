#!/bin/bash

# Deploy Google Cloud Function

echo "Starting Google Cloud Function deployment process..."

function_name="playgist_function"
runtime="python312"
region="us-central1"
source_dir="./source/playgist_function"
entry_point="handler"
memory="1024MB"

echo "Function Name: $function_name"
echo "Runtime: $runtime"
echo "Region: $region"
echo "Source Directory: $source_dir"
echo "Entry Point: $entry_point"
echo "Memory: $memory"
echo "Initiating deployment..."

gcloud functions deploy "$function_name" \
    --runtime="$runtime" \
    --trigger-http \
    --allow-unauthenticated \
    --gen2 \
    --region="$region" \
    --source="$source_dir" \
    --entry-point="$entry_point" \
    --memory="$memory"

deployment_status=$?

if [ $deployment_status -eq 0 ]; then
    echo "Deployment of $function_name completed successfully."
else
    echo "Deployment of $function_name failed with exit code $deployment_status."
fi

echo "Deployment process finished."
