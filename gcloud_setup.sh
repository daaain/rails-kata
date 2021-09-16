#!/bin/sh
set -e

export REGION=europe-west1
export CLOUD_SQL_INSTANCE=rails-app
export DATABASE_NAME=rails
export DATABASE_USERNAME=rails
export DATABASE_PASSWORD=$(cat /dev/urandom | LC_ALL=C tr -dc '[:alpha:]'| fold -w 50 | head -n1)
export DOCKER_IMAGE=gcr.io/$PROJECT_ID/rails-app

# Switch to the project and set region
gcloud config set project $PROJECT_ID
gcloud config set compute/region $REGION

# Create the Cloud SQL instance
gcloud sql instances create $CLOUD_SQL_INSTANCE \
    --database-version POSTGRES_13 \
    --tier db-f1-micro \
    --region $REGION

# Create the database
gcloud sql databases create $DATABASE_NAME --instance $CLOUD_SQL_INSTANCE

# Create the database user
gcloud sql users create $DATABASE_USERNAME --instance=$CLOUD_SQL_INSTANCE --password=$DATABASE_PASSWORD

# Create a storage bucket for assets and set permissions to world readable
gsutil mb -l $REGION "gs://$PROJECT_ID-assets"
gsutil iam ch allUsers:objectViewer "gs://$PROJECT_ID-assets"

# Set up Rails credentials and master password
CREDS="
gcp:
  db_password: $DATABASE_PASSWORD
"
echo "$CREDS" > creds
docker-compose run --rm --entrypoint /bin/sh app -c 'EDITOR="cat creds >> " bin/rails credentials:edit'

# Set up the production environment file
sed "s/ PROJECT_ID/ $PROJECT_ID/g" .env.production-template > .env