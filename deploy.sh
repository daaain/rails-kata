#!/bin/sh
set -e

export REGION=europe-west1
export CLOUD_SQL_INSTANCE=rails-app
export DOCKER_IMAGE=gcr.io/$PROJECT_ID/rails-app

# First we deploy in "warmup" mode which does the database migration and other setup tasks – see entrypoint.sh
gcloud run deploy rails \
  --image=$DOCKER_IMAGE:$APP_VERSION \
  --platform=managed \
  --region=$REGION \
  --set-cloudsql-instances=$PROJECT_ID:$REGION:$CLOUD_SQL_INSTANCE \
  --update-env-vars=WARMUP_DEPLOY=true \
  --allow-unauthenticated # this just means publicly accessible

# Then we deploy with just the Rails app running
gcloud run deploy rails \
  --image=$DOCKER_IMAGE:$APP_VERSION \
  --platform=managed \
  --region=$REGION \
  --update-env-vars=WARMUP_DEPLOY=false