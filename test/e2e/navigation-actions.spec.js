/* global describe,beforeEach,afterEach,it */
const AppOverviewPage = require('./models/app-overview');
const Button = require('./models/button');
const timeoutTime = 10000;
const selectors = require('./lib/selectors');

describe('Navigation Actions => ', () => {

  let appOverview = null;
  beforeEach(async () => {
    appOverview = new AppOverviewPage();
    await appOverview.get('sense-navigation_v1x');
  });

  afterEach(async () => {
    await browser.executeScript('window.sessionStorage.clear();');
    await browser.executeScript('window.localStorage.clear();');
    // Await browser.sleep(1000);
  });

  it('should be possible to use a button to do NOTHING', async () => {

    const targetSheetId = 'd38aba7e-c691-448c-bb69-91e63374f716';
    const buttonTitle = 'Nothing';

    await appOverview.openSheet('test:navigation-actions');
    await browser.wait(EC.visibilityOf($(selectors.qvtSheet)), timeoutTime, 'Sheet was not visible');
    await browser.wait(EC.visibilityOf($(`div[title="${buttonTitle}"]`), timeoutTime, `Button "${buttonTitle}" was not visible`));

    const btn = new Button();
    await btn.get(buttonTitle);
    await btn.click();
    await browser.sleep(200);

    await browser.wait(EC.urlContains(`${targetSheetId}/state/analysis`), timeoutTime);

  });

  it('should be possible to use button for navigate to EDIT MODE', async () => {

    const targetSheetId = 'd38aba7e-c691-448c-bb69-91e63374f716';
    const buttonTitle = 'Switch to Edit';

    await appOverview.openSheet('test:navigation-actions');
    await browser.wait(EC.visibilityOf($(selectors.qvtSheet)), timeoutTime, 'Sheet was not visible');
    await browser.wait(EC.visibilityOf($(`div[title="${buttonTitle}"]`), timeoutTime, `Button "${buttonTitle}" was not visible`));

    const btn = new Button();
    await btn.get(buttonTitle);
    await btn.click();

    await browser.wait(EC.urlContains(`${targetSheetId}/state/edit`), timeoutTime);
  });

  it.only('should be possible to use button to navigate to the FIRST sheet', async () => {
    const targetSheetId = '392462be-a70b-4f14-a4cd-05a7aab19ed8';
    const buttonTitle = 'GotoFirstSheet';

    await appOverview.openSheet('test:navigation-actions');

    await browser.wait(EC.visibilityOf($(selectors.qvtSheet)), timeoutTime, 'Sheet was not visible');
    await browser.wait(EC.visibilityOf($(`div[title="${buttonTitle}"]`), timeoutTime, `Button "${buttonTitle}" was not visible`));

    const btn = new Button();
    await btn.get(buttonTitle);
    await btn.click();

    await browser.wait(EC.urlContains(targetSheetId), timeoutTime);
  });

  it.only('should be possible to use button to navigate to the LAST sheet', async () => {
    const targetSheetId = 'e9f4240b-2185-4b56-af7f-8e9a25253db0';
    const buttonTitle = 'GotoLastSheet';

    await appOverview.openSheet('test:navigation-actions');

    await browser.wait(EC.visibilityOf($(selectors.qvtSheet)), timeoutTime, 'Sheet was not visible');
    await browser.wait(EC.visibilityOf($(`div[title="${buttonTitle}"]`), timeoutTime, `Button "${buttonTitle}" was not visible`));

    const btn = new Button();
    await btn.get(buttonTitle);
    await btn.click();

    await browser.wait(EC.urlContains(targetSheetId), timeoutTime);
  });

  it('should be possible to use button to navigate to the NEXT sheet', async () => {
    const targetSheetId = '36b1f160-b676-4a3e-a753-c5f51a467f90';
    const buttonTitle = 'GotoNextSheet';

    await appOverview.openSheet('first');
    await browser.wait(EC.visibilityOf($(selectors.qvtSheet)), timeoutTime, 'Sheet was not visible');
    await browser.wait(EC.visibilityOf($(`div[title="${buttonTitle}"]`), timeoutTime, `Button "${buttonTitle}" was not visible`));

    const btn = new Button();
    await btn.get(buttonTitle);
    await btn.click();

    await browser.wait(EC.urlContains(targetSheetId), timeoutTime);

  });

  it('should be possible to use button to navigate to the PREV sheet', async () => {
    const targetSheetId = '392462be-a70b-4f14-a4cd-05a7aab19ed8';
    const buttonTitle = 'GotoPrevSheet';

    await appOverview.openSheet('second');
    await browser.wait(EC.visibilityOf($(selectors.qvtSheet)), timeoutTime, 'Sheet was not visible');
    await browser.wait(EC.visibilityOf($(`div[title="${buttonTitle}"]`), timeoutTime, `Button "${buttonTitle}" was not visible`));

    const btn = new Button();
    await btn.get(buttonTitle);
    await btn.click();

    await browser.wait(EC.urlContains(targetSheetId), timeoutTime);
  });

  it('should be possible to use button to navigate to a SELECTED sheet', async () => {
    const targetSheetId = '7976f92b-8b88-444a-b10f-6d878e72d498'; // =Icon-Buttons

    await appOverview.openSheet('test:navigation-actions');
    await browser.wait(EC.visibilityOf($(selectors.qvtSheet)), timeoutTime, 'Sheet was not visible');

    const btn = new Button();
    await btn.get('GotoSelectedSheet');
    await btn.click();

    await browser.wait(EC.urlContains(targetSheetId), timeoutTime);
  });

  it('should be possible to use button to navigate to a SPECIFIC sheet', async () => {
    const targetSheetId = '7976f92b-8b88-444a-b10f-6d878e72d498'; // =Icon-Buttons

    await appOverview.openSheet('test:navigation-actions');
    await browser.wait(EC.visibilityOf($(selectors.qvtSheet)), timeoutTime, 'Sheet was not visible');

    const btn = new Button();
    await btn.get('GotoSpecificSheet');
    await btn.click();

    await browser.wait(EC.urlContains(targetSheetId), timeoutTime);
  });

  it('should be possible to use button to open a new website (SAME window)', async () => {

    const buttonTitle = 'OpenUrl:self';

    await appOverview.openSheet('test:navigation-actions');
    await browser.wait(EC.visibilityOf($(selectors.qvtSheet)), timeoutTime, 'Sheet was not visible');
    await browser.wait(EC.visibilityOf($(`div[title="${buttonTitle}"]`), timeoutTime, `Button "${buttonTitle}" was not visible`));

    const btn = new Button();
    await btn.get(buttonTitle);
    await btn.click();

    await browser.wait(EC.urlContains('https://github.com'), timeoutTime);
  });

  it('should be possible to use button to open a new website (NEW window)', async () => {

    const buttonTitle = 'OpenUrl:blank';

    await appOverview.openSheet('test:navigation-actions');
    await browser.wait(EC.visibilityOf($(selectors.qvtSheet)), timeoutTime, 'Sheet was not visible');
    await browser.wait(EC.visibilityOf($(`div[title="${buttonTitle}"]`), timeoutTime, `Button "${buttonTitle}" was not visible`));

    const btn = new Button();
    await btn.get(buttonTitle);
    await btn.click();

    await browser.sleep(1000);
    let handles = await browser.getAllWindowHandles();

    await browser.switchTo().window(handles[1]);
    let newUrl = await browser.getCurrentUrl();
    expect(newUrl).to.contain('https://github.com');
  });

  it('should be possible to use button to go to a story', async () => {
    const targetId = '3bf18616-4e88-46df-bbec-9287e5f52f83'; // =test-story
    const buttonTitle = 'GotoStory';

    await appOverview.openSheet('test:navigation-actions');
    await browser.wait(EC.visibilityOf($(selectors.qvtSheet)), timeoutTime, 'Sheet was not visible');
    await browser.wait(EC.visibilityOf($(`div[title="${buttonTitle}"]`), timeoutTime, `Button "${buttonTitle}" was not visible`));

    const btn = new Button();
    await btn.get(buttonTitle);
    await btn.click();

    await browser.wait(EC.urlContains(targetId), timeoutTime);
  });

});
