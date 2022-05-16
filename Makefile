THIS_FILE := $(lastword $(MAKEFILE_LIST))
.PHONY: help build up start down run stop
build:
		docker-compose -f docker-compose.yml build $(c)
up:
		docker-compose -f docker-compose.yml up -d $(c)
start:
		docker-compose -f docker-compose.yml start $(c)
down:
		docker-compose -f docker-compose.yml down $(c)
run:
		docker-compose build && docker-compose up
stop:
		docker-compose down --rmi local