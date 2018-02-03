/* global describe, it */
const AppOverviewPage = require('./models/app-overview');
const timeoutTime = 10000;
const selectors = {
  qvtSheet: '.qvt-sheet'
};

describe('Button Icons => ', () => {

  describe('using Bs3 theme', () => {
    it('should be equal to the taken screenshot', async () => {

      const appOverview = new AppOverviewPage();
      await appOverview.get('sense-navigation_v1x');

      await appOverview.openSheet('Icon-Buttons - Bootstrap v3');

      await browser.wait(EC.visibilityOf($(selectors.qvtSheet)), timeoutTime, 'Sheet was not visible');

      return expect(await browser.takeImageOf({selector: selectors.qvtSheet})).to.matchImageOf('button_icons_bootstrap_v3', 'button_icons');
    });
  });

  describe('using Lui-theme', () => {
    it('should be equal to the taken screenshot', async () => {

      const appOverview = new AppOverviewPage();
      await appOverview.get('sense-navigation_v1x');

      await appOverview.openSheet('Icon-Buttons - Leonardo UI');

      await browser.wait(EC.visibilityOf($(selectors.qvtSheet)), timeoutTime, 'Sheet was not visible');

      return expect(await browser.takeImageOf({selector: selectors.qvtSheet})).to.matchImageOf('button_icons_leonardo-ui', 'button_icons');
    });
  });

});

