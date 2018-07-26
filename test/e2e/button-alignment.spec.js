const AppOverviewPage = require('./models/app-overview');
const timeoutTime = 10000;
const selectors = require('./lib/selectors');

describe.only('Button Alignment => ', () => {

  it('should be equal to the taken screenshots (Bootstrap v3)', async () => {

    const appOverview = new AppOverviewPage();
    await appOverview.get('sense-navigation_v1x');

    await appOverview.openSheet('Button Alignment - Bootstrap v3');

    await browser.wait(EC.visibilityOf($(selectors.qvtSheet)), timeoutTime, 'Sheet was not visible');
    await browser.actions()
      .mouseMove(element(by.css(selectors.qvClient), {x: 0, y: 0}))
      .mouseDown()
      .perform();
    await browser.sleep(200);

    return expect(await browser.takeImageOf({selector: selectors.qvtSheet})).to.matchImageOf('button_alignment_bootstrap_v3', 'button_alignment');
  });

  it('should be equal to the screenshots taken (Leonardo UI)', async () => {

    const appOverview = new AppOverviewPage();
    await appOverview.get('sense-navigation_v1x');

    await appOverview.openSheet('Button Alignment - Leonardo UI');
    await browser.sleep(200);

    await browser.wait(EC.visibilityOf($(selectors.qvtSheet)), timeoutTime, 'Sheet was not visible');
    await browser.actions()
      .mouseMove(element(by.css(selectors.qvClient), {x: 0, y: 0}))
      .mouseDown()
      .perform();
    await browser.sleep(200);

    return expect(await browser.takeImageOf({selector: selectors.qvtSheet})).to.matchImageOf('button_alignment_leonardo_ui', 'button_alignment');
  });

});

