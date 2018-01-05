'use strict';

const path = require('path');
const extend = require('extend');
const util = require('util');

process.env.SELENIUM_PROMISE_MANAGER = 0;

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
    mochaOpts: {
      //   bail: true,
    },
    multiCapabilities: [],
    specs: [
      path.resolve(__dirname, './**/*.spec.js'),
    ],
    beforeLaunch() { },
    onComplete() {
      browser.manage().logs().get('browser').then(browserLog => {
        console.log(`log: ${util.inspect(browserLog)}`); //eslint-disable-line
      });
    }
  };
  return extend(true, baseConfig, config);
};
