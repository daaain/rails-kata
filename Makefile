default: build db_create start logs

build:
	docker-compose build --build-arg GROUPID=$$(id -g) --build-arg USERID=$$(id -u)
.PHONY: build

start:
	docker-compose up --detach --force-recreate
.PHONY: start

logs:
	docker-compose logs --follow --timestamps --tail=100
.PHONY: logs

db_create:
	docker-compose run --rm app rake db:create
.PHONY: db_create

rails:
	docker-compose run --rm app rails $(RUN_ARGS)
.PHONY: rails

app_shell:
	docker-compose exec app ash
.PHONY: app_shell

stop:
	docker-compose down
.PHONY: stop

release_build:
	docker-compose --file compose-production.yml build
.PHONY: release_build

release_push:
	docker tag $$DOCKER_IMAGE "$$DOCKER_IMAGE:$$APP_VERSION"
	docker push $$DOCKER_IMAGE:$$APP_VERSION
	docker tag $$DOCKER_IMAGE "$$DOCKER_IMAGE:latest"
	docker push $$DOCKER_IMAGE:latest
.PHONY: release_push

show_secrets:
	docker-compose run --rm --entrypoint /bin/sh app -c 'EDITOR=cat bin/rails credentials:edit'
.PHONY: show_secrets

# this hack allows us to pass any arguments to the commands listed at the end of first line
ifneq (,$(findstring $(firstword $(MAKECMDGOALS)),rails))
  RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  $(eval $(RUN_ARGS):dummy;@:)
endif
