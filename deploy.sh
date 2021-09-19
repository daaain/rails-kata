#!/bin/sh
set -e

if [ -z $PROJECT_ID ] ||[ -z $APP_VERSION ]; then
  echo "PROJECT_ID and APP_VERSION must be set"
  exit 1
fi

export REGION=europe-west1
export CLOUD_SQL_INSTANCE=rails-app
export DOCKER_IMAGE=gcr.io/$PROJECT_ID/rails-app

# First deploy with database migration if called with MIGRATE=true – see entrypoint.sh
if [ "$MIGRATE" == "true" ] && [ "$DB_SEED" == "true" ]; then
  gcloud run deploy rails \
    --image=$DOCKER_IMAGE:$APP_VERSION \
    --platform=managed \
    --region=$REGION \
    --update-env-vars=MIGRATE=true,DB_SEED=true \
    --set-cloudsql-instances=$PROJECT_ID:$REGION:$CLOUD_SQL_INSTANCE \
    --allow-unauthenticated # this just means publicly accessible
elif [ "$MIGRATE" == "true" ]; then
  gcloud run deploy rails \
    --image=$DOCKER_IMAGE:$APP_VERSION \
    --platform=managed \
    --region=$REGION \
    --update-env-vars=MIGRATE=true \
    --set-cloudsql-instances=$PROJECT_ID:$REGION:$CLOUD_SQL_INSTANCE \
    --allow-unauthenticated # this just means publicly accessible
elif [ "$DB_SEED" == "true" ]; then
  gcloud run deploy rails \
    --image=$DOCKER_IMAGE:$APP_VERSION \
    --platform=managed \
    --region=$REGION \
    --update-env-vars=DB_SEED=true \
    --set-cloudsql-instances=$PROJECT_ID:$REGION:$CLOUD_SQL_INSTANCE \
    --allow-unauthenticated # this just means publicly accessible
fi

# Then we deploy with just the Rails app running
gcloud run deploy rails \
  --image=$DOCKER_IMAGE:$APP_VERSION \
  --platform=managed \
  --region=$REGION \
  --remove-env-vars=MIGRATE,DB_SEED \
  --set-cloudsql-instances=$PROJECT_ID:$REGION:$CLOUD_SQL_INSTANCE \
  --allow-unauthenticated # this just means publicly accessible
