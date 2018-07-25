
help: 												## Call the help
	@echo ''
	@echo 'Available commands:'
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@echo ''
.PHONY: help

run-dev: build 								## Run the local development environment
	export ENV=dev && \
	./down.sh && \
	./up.sh && \
	echo "" && \
	echo "Open http://localhost:4848/sense/app/sense-navigation_v1x.qvf"
.PHONY: run-dev

build:                				## Build the extension (dev build)
	npm run build
.PHONY: build

release:              				## Build the extensions (release build)
	npm run release
.PHONY: release

gen-readme:           				## Generate the README.md (using docker-verb)
	docker run --rm -v ${PWD}:/opt/verb stefanwalther/verb
.PHONY: gen-readme

up:														## Bring the dev environment up
	npm run up
.PHONY: up

down:													## Tear down the dev environment
	npm run down -t 0
.PHONY: down

build-test:										## Build the test image.
	# --force-rm
	docker build -t stefanwalther/sense-navigation-test -f Dockerfile.test .
.PHONY: build-test

up-test: build-test
	docker-compose --f=docker-compose.test.yml up
.PHONY: up-test

down-test:
	docker-compose --f=docker-compose.test.yml down -t 0
.PHONY: down-test

test-e2e-dev:										## Test dev build (locally)
	export ENV=dev && \
	export VER_QIX_ENGINE=12.203.0
	npm run release && \
	./scripts/down.sh && \
	./scripts/up.sh && \
	npm run test:e2e
.PHONY: test-e2e-dev

test-e2e-release: 							## Test release build (locally)
	export ENV=release && \
	npm run release && \
	./scripts/down.sh && \
	./scripts/up.sh && \
	npm run dc-rs && \
	npm run test:e2e
.PHONY: test-e2e-release

test-e2e: clean-test-results test-e2e-dev test-e2e-release
.PHONY: test-e2e

clean-test-results:							## Clean up all the e2e test results
	rm -rf ./test/e2e/artifacts/diff
	rm -rf ./test/e2e/artifacts/regression
	rm -rf ./test/e2e/artifacts/screenshots
	rm -rf ./test/e2e/artifacts/chrome-report-**.*
.PHONY: clean-test-results

webdriver-update:								## Update WebDriver
	npm run test:setup-webdriver
.PHONY: webdriver-update

test-dockerignore:
	docker build -f Dockerfile.build-context -t stefanwalther/build-context . && \
  docker run --rm -it stefanwalther/build-context
.PHONY: test-dockerignore

run-integration-tests:					## Run the integration tests
	docker-compose --f=docker-compose.integration-tests.yml run sense-navigation-test npm run test:integration
.PHONY: run-integration-tests



