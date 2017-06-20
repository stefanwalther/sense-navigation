const baseConfig = require('after-work.js/dist/config/conf.js').config;
const httpServer = require('after-work.js/dist/utils').httpServer;
const extend = require('extend');

delete baseConfig.multiCapabilities;

const config = extend(true, baseConfig, {
  baseUrl: 'http://localhost:8000',
  directConnect: true,
  capabilities: {
    browserName: 'chrome'
  },
  mochaOpts: {
    reporterOptions: {
      xunit: true
    }
  },
  beforeLaunch() {
    return httpServer({
      logLevel: 'info',
      port: 8000,
      server: {
        baseDir: './test/fixtures/',
        routes: {
          '/src': './build/dev/',
          '/main': './test/fixtures/index.html'
        }
      }
    });
  }
});

module.exports = {
  config: config
};
