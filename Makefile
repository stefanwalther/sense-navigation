
## Todo: OK
help: 												## Call the help
	@echo ''
	@echo 'Available commands:'
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@echo ''
.PHONY: help

## Todo: probably obsolete
run-dev: build 								## Run the local development environment
	export ENV=dev && \
	./down.sh && \
	./up.sh && \
	echo "" && \
	echo "Open http://localhost:4848/sense/app/sense-navigation_v1x.qvf"
.PHONY: run-dev

build: build-dev build-release
.PHONY: build

# Todo: OK
build-dev:                		## Build the extension (dev build)
	npm run build
.PHONY: build-dev

# Todo: OK
build-release:              	## Build the extensions (release build)
	npm run release
.PHONY: build-release

# Todo: OK
gen-readme:           				## Generate the README.md (using docker-verb)
	docker run --rm -v ${PWD}:/opt/verb stefanwalther/verb
.PHONY: gen-readme

up: down build-dev									## Bring the dev environment up
	ENV=dev
	docker-compose up -d
	@echo ""
	@echo "DEV BUILD::"
	@echo "Open the app at http://localhost:9076/sense/app/sense-navigation_v1x.qvf"
	@echo ""
.PHONY: up

down:													## Tear down the dev environment
	docker-compose down -t 0
.PHONY: down

up-release: build-release			## Bring up the release environment
	ENV=release
	docker-compose up -d
	@echo ""
	@echo "RELEASE BUILD:"
	@echo "Open the app at http://localhost:9076/sense/app/sense-navigation_v1x.qvf"
	@echo ""
.PHONY: up-release

down-release:								## Tear down the relase environment
	docker-compose down -t 0
.PHONY: down-release

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

up-github:
	docker-compose -f docker-compose.github.yml up -d
	@echo ""
	@echo "Open the app at http://localhost:9076/sense/app/empty.qvf"
	@echo ""

.PHONY: up-github

down-github:
	docker-compose -f docker-compose.github.yml down -t 0
.PHONY: down-github

clean-e2e-test-results:																		## Clean up all the e2e test results
	rm -rf ./test/e2e/__artifacts__/diff
	rm -rf ./test/e2e/__artifacts__/regression
	rm -rf ./test/e2e/__artifacts__/screenshots
	rm -rf ./test/e2e/__artifacts__/chrome-report-**.*
.PHONY: clean-e2e-test-results

clean-e2e-baseline:																				## Delete the baseline of e2e results, atttion, this might break things ...
	rm -rf ./test/e2e/__artifacts__/baseline
.PHONY: clean-e2e-baseline

webdriver-update:																					## Update WebDriver
	npm run test:setup-webdriver
.PHONY: webdriver-update

test-dockerignore:																				## Helper to make sure that dockerignore is working properly
	docker build -f Dockerfile.build-context -t stefanwalther/build-context . && \
  docker run --rm -it stefanwalther/build-context
.PHONY: test-dockerignore

test-integration-local:																		## Run the integration tests (locally)
	docker-compose -f docker-compose.integration-tests.yml up -d --build
	npx webdriver-manager update --gecko false --versions.chrome 2.38
	npx aw protractor -c ./test/e2e/aw.config.js --baseUrl  http://localhost:9076/sense/app/ --seleniumAddress http://localhost:4444/wd/hub
	docker-compose -f docker-compose.integration-tests.yml  down -t 0
.PHONY: t

# This basically runs the same tests as on CircleCI, except the linting.
test-integration: build-test clean-e2e-test-results				## Run the integration tests (in docker containers)
	docker-compose -f docker-compose.integration-tests.yml up -d --build
	docker exec -it sense-navigation-test npm run test:integration:container
	docker-compose -f docker-compose.integration-tests.yml down -t 0
.PHONY: test-integration

test: build-test clean-e2e-test-results test-integration	## Run all tests
.PHONY: test
