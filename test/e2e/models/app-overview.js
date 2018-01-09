'use strict';

const EC = protractor.ExpectedConditions;
const timeoutTime = 10000;

const selectors = {
  loader: '.qv-block-ui',
  grid: '#grid',
  sheetContainer: '.av-content-container'
};
const appOverview = {
  sheet: '.qv-content-item'
};

class AppOverviewPage {
  constructor(...params) {
    if (params.length) {
      this.get(...params);
    }
  }
  async get(appId) {
    await browser.get(`${appId}.qvf`, timeoutTime);
    await browser.wait(EC.presenceOf($(selectors.sheetContainer)), timeoutTime, 'sheetContainer element did not appear');
    return browser.wait(EC.stalenessOf($(selectors.loader)), timeoutTime, 'qv-loader did not disappear').then(() => {});

  }
  async openSheet(sheetName) {

    await $$(appOverview.sheet)
      .filter(elem => elem.getText().then(text => text === sheetName))
      .first()
      .click();
    await browser.wait(EC.visibilityOf($(selectors.grid)), timeoutTime, '#grid element did not appear');
    await browser.wait(EC.invisibilityOf($(selectors.loader)), timeoutTime, 'qv-loader did not disappear');
  }

  async areSheetIconsPresent() {
    return $(appOverview.sheet).isPresent();
  }

}

AppOverviewPage.selectors = selectors;

module.exports = AppOverviewPage;
