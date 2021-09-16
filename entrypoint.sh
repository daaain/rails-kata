#!/bin/sh
set -e

echo "Running environment: $RAILS_ENV"

if [ "$WARMUP_DEPLOY" == "true" ]; then
  # The traditional Rails migration
  echo "Warmup deploy: running migrations..."
  bundle exec rake db:migrate
  echo "Warmup deploy: migrations done"

  # This is a custom Rake task which perform additional steps our application needs 
  # (e.g. setup cron jobs via Cloudtasker)
#   echo "Warmup deploy: running deploy tasks..."
#   bundle exec rake deploy:prepare
#   echo "Warmup deploy: deploy tasks done"

  # Finally, compile assets
  echo "Warmup deploy: compiling assets..."
  bundle exec rake assets:precompile
  echo "Warmup deploy: asset compiling done..."
fi

echo "Starting on port: $PORT"

# Then exec the container's main process (what's set as CMD in the Dockerfile).
bundle exec ${@}