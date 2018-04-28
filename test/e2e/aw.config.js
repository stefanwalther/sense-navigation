'use strict';

const path = require('path');
const extend = require('extend');
const util = require('util');

module.exports = function initConfig(baseConfig) { // eslint-disable-line func-names
  const config = {
    baseUrl: 'http://127.0.0.1:9076/sense/app/',
    directConnect: true,
    artifactsPath: 'test/e2e/artifacts',
    capabilities: {
      browserName: 'chrome',
      unexpectedAlertBehaviour: 'accept',
      chromeOptions: {
        args: ['--disable-infobars --window-size=1024x768']
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
      bail: false
    },
    multiCapabilities: [],
    specs: [
      path.resolve(__dirname, './**/*.spec.js')
    ],
    beforeLaunch() {
    },
    onComplete() {
      browser.manage().logs().get('browser').then(browserLog => {
        console.log(`browser log: ${util.inspect(browserLog)}`); //eslint-disable-line
      });
    }
  };
  return extend(true, baseConfig, config);
};
