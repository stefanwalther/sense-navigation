'use strict';

const path = require('path');
const extend = require('extend');
const util = require('util');

// process.env.SELENIUM_PROMISE_MANAGER = 1;

module.exports = function initConfig(baseConfig) {
  const config = {
    baseUrl: 'http://127.0.0.1:4848/sense/app/',
    directConnect: true,
    artifactsPath: 'test/e2e/artifacts',
    capabilities: {
      browserName: 'chrome',
      unexpectedAlertBehaviour: 'accept',
      chromeOptions: {
        args: ['--disable-infobars']
      }
    },
    plugins: [
      {
        package: 'protractor-console-plugin',
        failOnWarning: false,
        failOnError: false,
        logWarnings: false
      },
      {
        package: 'protractor-console',
        logLevels: ['debug']
      }
    ],
    mochaOpts: {
      bail: true
    },
    multiCapabilities: [],
    specs: [
      path.resolve(__dirname, './**/*.spec.js')
    ],
    beforeLaunch() {
    },
    onComplete() {
      browser.manage().logs().get('browser').then((browserLog) => {
        console.log(`browser log: ${util.inspect(browserLog)}`); //eslint-disable-line
      });
    }
  };
  return extend(true, baseConfig, config);
};
