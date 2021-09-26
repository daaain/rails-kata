#!/bin/sh
set -e

. ./env.sh

gcloud config set project $PROJECT_ID

# First deploy with database migration if called with MIGRATE=true – see entrypoint.sh
if [ "$MIGRATE" == "true" ] && [ "$DB_SEED" == "true" ]; then
  gcloud run deploy rails \
    --image=$DOCKER_IMAGE:$APP_VERSION \
    --platform=managed \
    --region=$REGION \
    --update-env-vars=MIGRATE=true,DB_SEED=true \
    --set-cloudsql-instances=$PROJECT_ID:$REGION:$CLOUD_SQL_INSTANCE \
    --allow-unauthenticated
elif [ "$MIGRATE" == "true" ]; then
  gcloud run deploy rails \
    --image=$DOCKER_IMAGE:$APP_VERSION \
    --platform=managed \
    --region=$REGION \
    --update-env-vars=MIGRATE=true \
    --set-cloudsql-instances=$PROJECT_ID:$REGION:$CLOUD_SQL_INSTANCE \
    --allow-unauthenticated
elif [ "$DB_SEED" == "true" ]; then
  gcloud run deploy rails \
    --image=$DOCKER_IMAGE:$APP_VERSION \
    --platform=managed \
    --region=$REGION \
    --update-env-vars=DB_SEED=true \
    --set-cloudsql-instances=$PROJECT_ID:$REGION:$CLOUD_SQL_INSTANCE \
    --allow-unauthenticated
fi

# Then we deploy with just the Rails app running
gcloud run deploy rails \
  --image=$DOCKER_IMAGE:$APP_VERSION \
  --platform=managed \
  --region=$REGION \
  --remove-env-vars=MIGRATE,DB_SEED \
  --set-cloudsql-instances=$PROJECT_ID:$REGION:$CLOUD_SQL_INSTANCE \
  --allow-unauthenticated # this just means publicly accessible
