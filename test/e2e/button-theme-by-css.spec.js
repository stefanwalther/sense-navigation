/* global describe, it */
const AppOverviewPage = require('./models/app-overview');
const timeoutTime = 10000;
const selectors = {
  qvtSheet: '.qvt-sheet'
};

describe('Buttons By Css => ', () => {

  it('should be equal to the taken screenshot', async () => {

    const appOverview = new AppOverviewPage();
    await appOverview.get('sense-navigation_v1x');

    await appOverview.openSheet('test:button-theme-by-css');

    await browser.wait(EC.visibilityOf($(selectors.qvtSheet)), timeoutTime, 'Sheet was not visible');

    return expect(await browser.takeImageOf({selector: selectors.qvtSheet})).to.matchImageOf('button_by_css_samples', 'button_by_css');
  });

});
