#!/bin/sh
set -e

echo "Running environment: $RAILS_ENV"

# Install Gem dependencies
bundle check || bundle install --jobs 20 --retry 5

# Run migrations and create db if it doesn't exist yet
bundle exec rake db:create db:migrate

# Then exec the container's main process (what's set as CMD in the Dockerfile).
bundle exec ${@}
