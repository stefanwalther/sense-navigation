
.PHONY: help build run-dev

help: 				## Call the help
	@echo ''
	@echo 'Available commands:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@echo ''

run-dev: build 		## Run the local development environment
	docker-compose --f=./docker-compose.dev.yml up -d --build
	@echo ""
	@echo "Open http://localhost:9076/sense/app/sense-navigation.qvf"
	# We might use: python -mwebbrowser http://example.com

build: 				## Build the extension (dev build)
	npm run build

release: 			## Build the extensions (release build)
	npm run release
.PHONY: release

gen-readme:
	docker run --rm -v ${PWD}:/opt/verb stefanwalther/verb
.PHONY: docs
