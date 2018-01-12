'use strict';

const AppOverviewPage = require('./models/app-overview');
const Button = require('./models/button-click');
const timeoutTime = 10000;

describe('Navigation Actions => ', () => {

  let appOverview = null;
  beforeEach(async () => {
    appOverview = new AppOverviewPage();
    await appOverview.get('sense-navigation_v1x');
  });

  afterEach(async () => {
    await browser.executeScript('window.sessionStorage.clear();');
    await browser.executeScript('window.localStorage.clear();');
    await browser.sleep(1000);
  });

  it('should be possible to use button for navigate to EDIT MODE', async () => {

    await appOverview.openSheet('test:navigation-actions');

    const btn = new Button();
    await btn.get('Switch to Edit');
    await btn.click();

    await browser.wait(EC.urlContains('/state/edit'), timeoutTime);
  });

  it('should be possible to use button to navigate to the FIRST sheet', async () => {
    const targetSheetId = '392462be-a70b-4f14-a4cd-05a7aab19ed8';

    await appOverview.openSheet('test:navigation-actions');
    const btn = new Button();
    await btn.get('GotoFirstSheet');
    await btn.click();

    await browser.wait(EC.urlContains(targetSheetId), timeoutTime);
  });

  it('should be possible to use button to navigate to the LAST sheet', async () => {
    const targetSheetId = 'e9f4240b-2185-4b56-af7f-8e9a25253db0';

    await appOverview.openSheet('test:navigation-actions');
    const btn = new Button();
    await btn.get('GotoLastSheet');
    await btn.click();

    await browser.wait(EC.urlContains(targetSheetId), timeoutTime);
  });

  it('should be possible to use button to navigate to the NEXT sheet', async () => {
    const targetSheetId = '36b1f160-b676-4a3e-a753-c5f51a467f90';

    await appOverview.openSheet('first');

    const btn = new Button();
    await btn.get('GotoNextSheet');
    await btn.click();

    await browser.wait(EC.urlContains(targetSheetId), timeoutTime);

  });

  it('should be possible to use button to navigate to the PREV sheet', async () => {
    const targetSheetId = '392462be-a70b-4f14-a4cd-05a7aab19ed8';

    await appOverview.openSheet('second');

    const btn = new Button();
    await btn.get('GotoPrevSheet');
    await btn.click();

    await browser.wait(EC.urlContains(targetSheetId), timeoutTime);
  });

  it('should be possible to use button to open a new website (SAME window)', async () => {

    await appOverview.openSheet('test:navigation-actions');

    const btn = new Button();
    await btn.get('OpenUrl:self');
    await btn.click();

    await browser.wait(EC.urlContains('https://github.com'), timeoutTime);
  });

  it('should be possible to use button to open a new website (NEW window)', async () => {

    await appOverview.openSheet('test:navigation-actions');

    const btn = new Button();
    await btn.get('OpenUrl:blank');
    await btn.click();

    await browser.sleep(1000);
    let handles = await browser.getAllWindowHandles();

    await browser.switchTo().window(handles[1]);
    let newUrl = await browser.getCurrentUrl();
    expect(newUrl).to.contain('https://github.com');
  });

});
