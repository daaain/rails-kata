# syntax=docker/dockerfile:1
FROM ruby:3.0.2-alpine

ENV RAILS_ENV=production
ENV NODE_ENV=production
ENV RACK_ENV=production
ENV RAILS_MAX_THREADS=60
ENV RAILS_SERVE_STATIC_FILES=true

ARG BUNDLE_VERSION

ARG APP_PATH
ENV APP_PATH=${APP_PATH}
ARG BUNDLE_PATH
ENV BUNDLE_PATH=${BUNDLE_PATH}
ARG TMP_PATH
ENV TMP_PATH=${TMP_PATH}
ARG RAILS_LOG_TO_STDOUT
ENV RAILS_LOG_TO_STDOUT=${RAILS_LOG_TO_STDOUT}

# install OS dependencies
RUN apk -U add --no-cache \
    build-base \
    postgresql-dev \
    postgresql-client \
    libxml2-dev \
    libxslt-dev \
    nodejs \
    yarn \
    imagemagick \
    tzdata \
    shadow \
    && rm -rf /var/cache/apk/*

# install Bundler
RUN gem install bundler --version "$BUNDLE_VERSION" \
    && rm -rf $GEM_HOME/cache/*

WORKDIR $APP_PATH

# create user
RUN addgroup --gid 11111 --system rails && adduser --system app --uid 11111 --ingroup rails
RUN chown -R app:rails "$(pwd)"

# install gems
COPY --chown=app:rails Gemfile Gemfile.lock ./
ENV BUNDLE_FROZEN=true
RUN bundle config set --local deployment 'true' && \
    bundle config set --local without 'development test' && \
    bundle install

# install node dependencies
COPY --chown=app:rails ./package.json ./yarn.lock ./
RUN yarn install --no-cache --frozen-lockfile

COPY --chown=app:rails . ./

RUN bundle exec rake assets:precompile

ENTRYPOINT ["./entrypoint.sh"]
CMD ["rails", "server"]
