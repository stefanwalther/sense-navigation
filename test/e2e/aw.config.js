const path = require('path');
const extend = require('extend');
const util = require('util');
const yargs = require('yargs');

const argv = yargs
  .option({
    baseUrl: {
      description: 'Base url to Qlik Sense',
      type: 'string',
      default: 'http://localhost:4848/sense/app'
    },
    seleniumAddress: {
      description: 'Selenium url',
      type: 'string',
      default: null
    },
    artifactsPath: {
      description: 'artifacts path',
      type: 'string',
      default: 'test/e2e/artifacts'
    },
    directConnect: {
      description: 'Connect directly',
      type: 'boolean',
      default: false
    },
    headLess: {
      description: 'Run headless tests',
      type: 'boolean',
      default: true
    }
  })
  .argv;

module.exports = function initConfig(baseConfig) { // eslint-disable-line func-names

  console.log('aw arguments: ', argv);

  const config = {
    baseUrl: argv.baseUrl,
    directConnect: argv.directConnect,
    artifactsPath: argv.artifactsPath,
    seleniumAddress: argv.seleniumAddress,
    capabilities: {
      browserName: 'chrome',
      unexpectedAlertBehaviour: 'accept',
      chromeOptions: {
        args: [
          // '--no-sandbox',
          // '--single-process',
          // '--disable-background-networking',
          '--disable-dev-shm-usage',
          '--disable-extensions',
          // '--disable-gpu', // only relevant for Windows
          '--disable-infobars',
          '--disable-popup-blocking',
          // '--enable-automation',
          '--window-size=1024,768',
          '--window-position=0,0'
        ]
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
      reporterOptions: {
        xunit: true
      },
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
    },
    afterLaunch() {
    }
  };

  if (argv.headLess) {
    config.capabilities.chromeOptions.args.push('--headless');
  }

  return extend(true, baseConfig, config);
};
