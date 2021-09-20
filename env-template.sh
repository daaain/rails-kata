export PROJECT_ID=

if [ -z $PROJECT_ID ]; then
  echo "PROJECT_ID must be set"
  return 1
fi

export APP_VERSION=0.0.1
export REGION=europe-west1
export CLOUD_SQL_INSTANCE=rails-app
export DOCKER_IMAGE=gcr.io/$PROJECT_ID/rails-app
