# Tests

## Prerequisites

* Running the tests requires a working installation of Docker for Windows/Docker for Mac
* Fork the repository
* Run `git clone <your-fork-url>`
* Run `npm install`
* Install WebDriver by running `npm run test:setup-webdriver`

## Run tests

> Run the tests as they would run on CircleCI

```
$ make test
```

The following will be performed:

* A local test-container will be created
* All tests will be executed (as they would on CircleCI)
* You'll see the result in your CLI

## Run tests locally

```
$ make test-e2e-interactive
```

The following will be performed:

* A local test-container will be created
* All tests will be executed (as they would on CircleCI)
* You'll see that a browser window will be opened where you can see the e2e-tests being executed
* You'll see the result in your CLI
