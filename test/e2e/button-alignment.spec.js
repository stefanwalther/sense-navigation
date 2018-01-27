const AppOverviewPage = require('./models/app-overview');
const timeoutTime = 10000;
const selectors = {
  qvtSheet: '.qvt-sheet'
};

describe('Button Alignment => ', () => {

  it('should be equal to the taken screenshot (Bootstrap v3)', async () => {

    const appOverview = new AppOverviewPage();
    await appOverview.get('sense-navigation_v1x');

    await appOverview.openSheet('Button Alignment - Bootstrap v3');

    await browser.wait(EC.visibilityOf($(selectors.qvtSheet)), timeoutTime, 'Sheet was not visible');

    return expect(await browser.takeImageOf({selector: selectors.qvtSheet})).to.matchImageOf('button_alignment_bootstrap_v3', 'button_alignment');
  });

  it('should be equal to the taken screenshot (Leonardo UI)', async () => {

    const appOverview = new AppOverviewPage();
    await appOverview.get('sense-navigation_v1x');

    await appOverview.openSheet('Button Alignment - Leonardo UI');

    await browser.wait(EC.visibilityOf($(selectors.qvtSheet)), timeoutTime, 'Sheet was not visible');

    return expect(await browser.takeImageOf({selector: selectors.qvtSheet})).to.matchImageOf('button_alignment_leonardo_ui', 'button_alignment');
  });

});

