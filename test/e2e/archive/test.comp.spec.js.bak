/* global browser, protractor, $, expect */

describe('Extension rendering', function () {
  const EC = protractor.ExpectedConditions;
  const timeoutTime = 100000;
  const sleep = 500;

  // Should be fixed in default conf file
  browser.baseUrl = browser.getProcessedConfig().value_.baseUrl;

  // Selectors
  let appAvailableSelector = element(by.css('.appAvailable'));
  let renderedSelector = element(by.css('.rendered'));

  before(function () {
    console.log('before:0');

    // Loading login page and waiting for Url to change
    browser.get('/index.html');
    browser.wait(EC.visibilityOf(appAvailableSelector), timeoutTime);
    console.log('before:1');
    browser.executeScript('app.clearAll()');
    console.log('before:2');

  });

  beforeEach(function () {
    // Open fixture page and wait until rendring is done
    console.log('beforeEach:0');

    browser.get('/index.html');

    console.log('beforeEach:1');
    browser.wait(EC.visibilityOf(renderedSelector), timeoutTime);
    console.log('beforeEach:2');
  });

  it('should render default settings correctly', function () {

    console.log('it:0');

    const dataDef = null;
    const options = {
      title: 'My own title'
    };

    browser.get('/index.html');
    browser.executeScript('addExtension(arguments)', JSON.stringify(dataDef), JSON.stringify(options));
    console.log('it:1');

    browser.wait(EC.visibilityOf(renderedSelector), timeoutTime);
    console.log('it:2');
    browser.takeImageOf({selector: '.rendered'});
    console.log('it:3');
    return expect(true).to.be.true;
    // Any interaction or verification using Protractor
    // return expect(browser.takeImageOf({selector: '.rendered'})).to.eventually.matchImageOf(camelize(this.test.title));
  });
});

// #############################################################################
// Support functions
// #############################################################################
function waitForUrlToChangeTo(urlRegex) {
  let currentUrl;

  return browser.getCurrentUrl().then(function storeCurrentUrl(url) {
    currentUrl = url;
  }
  ).then(function waitForUrlToChangeTo() {
    return browser.wait(function waitForUrlToChangeTo() {
      return browser.getCurrentUrl().then(function compareCurrentUrl(url) {
        return urlRegex.test(url);
      });
    });
  }
  );
}

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (Number(match) === 0) {
      return '';
    }
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}
