
help: 								## Call the help
	@echo ''
	@echo 'Available commands:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@echo ''
.PHONY: help

run-dev: build 				## Run the local development environment
	export ENV=dev && \
	docker kill $$(docker ps -q) && \
	docker-compose --f=./docker-compose.dev.yml up -d --build && \
	echo "" && \
	echo "Open http://localhost:4848/sense/app/sense-navigation_v1x.qvf"
	# We might use: python -mwebbrowser http://example.com

build:                ## Build the extension (dev build)
	npm run build
.PHONY: build

release:              ## Build the extensions (release build)
	npm run release
.PHONY: release

gen-readme:           ## Generate the README.md (using docker-verb)
	docker run --rm -v ${PWD}:/opt/verb stefanwalther/verb
.PHONY: gen-readme

test-e2e-release: 		## Test release build
	npm run release && \
	export ENV=release && \
	docker kill $$(docker ps -q) && \
	npm run dc-rs && \
	npm run test:e2e
.PHONY: test-e2e-release

test-e2e-dev:					## Test dev build
	npm run release && \
	export ENV=dev && \
	docker kill $$(docker ps -q) && \
	npm run dc-rs && \
	npm run test:e2e
.PHONY: test-e2e-dev

