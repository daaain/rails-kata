#!/bin/sh
set -e

echo "Running environment: $RAILS_ENV"

if [ "$MIGRATE" == "true" ]; then
  echo "Warmup deploy: running migrations..."
  bundle exec rails db:migrate
  echo "Warmup deploy: migrations done"
fi

if [ "$DB_SEED" == "true" ]; then
  echo "Warmup deploy: seeding database..."
  bundle exec rails db:fixtures:load
  echo "Warmup deploy: seeding database done"
fi

echo "Starting on port: $PORT"

# Then exec the container's main process (what's set as CMD in the Dockerfile).
bundle exec ${@}
