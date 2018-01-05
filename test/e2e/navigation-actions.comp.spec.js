/* global browser, protractor, $, expect */

describe('Extension rendering', function () {
  const timeoutTime = 10000;
  const sleep = 500;

  // Selectors
  let loadBlocker = $('.qv-block-ui');
  let sheetThumbs = $$('.qv-content-li:not(.qv-add)');
  let firstSheetThumb = sheetThumbs.first();
  let nextSheetButton = $('.qn-next-button');
  let sheetNameButton = $('[tid="4e25a2"]');

  beforeEach(async () => {
    await browser.get('sense-navigation_v1x.qvf');
    await browser.wait(EC.elementToBeClickable(firstSheetThumb), timeoutTime);
    await browser.wait(EC.stalenessOf(loadBlocker), timeoutTime);
  });

  xit('should render sheets correctly', async () => {
    let i = 0;
    let sheetThumbsCount = await sheetThumbs.count();
    await firstSheetThumb.click();

    while (i < sheetThumbsCount) {
      i++;

      await browser.wait(EC.elementToBeClickable(sheetNameButton), timeoutTime);
      let sheetName = await sheetNameButton.getText();

      await expect(browser.takeImageOf({selector: '#grid'})).to.eventually.matchImageOf(sheetName);
      if (i < sheetThumbsCount) await nextSheetButton.click();
    }
  });

  it('should be possible to use button for navigate to edit mode', async () => {
    await sheetThumbs
      .filter(elem => elem.getText().then(text => text === 'test:navigation-actions'))
      .first()
      .click();

    await browser.sleep(1000);
    await browser.wait(EC.visibilityOf($('#grid')), timeoutTime);
    await browser.wait(EC.invisibilityOf(loadBlocker), timeoutTime);

    await $$('.btn')
      .filter(elem => elem.getText().then(text => text === 'Switch to Edit'))
      .first()
      .click();

    await browser.wait(EC.urlContains('/state/edit'), timeoutTime);
  });

  it('should be possible to use button to navigate to the first sheet', async () => {
    const targetSheetId = '392462be-a70b-4f14-a4cd-05a7aab19ed8';

    await sheetThumbs
      .filter(elem => elem.getText().then(text => text === 'test:navigation-actions'))
      .first()
      .click();

    await browser.wait(EC.visibilityOf($('#grid')), timeoutTime);
    await browser.wait(EC.invisibilityOf(loadBlocker), timeoutTime);

    await $$('.btn')
      .filter(elem => elem.getText().then(text => text === 'GotoSheet:First'))
      .first()
      .click();

    await browser.wait(EC.urlContains(targetSheetId), timeoutTime);

  });

  it('should be possible to use button to navigate to the last sheet', async () => {
    const targetSheetId = 'e9f4240b-2185-4b56-af7f-8e9a25253db0';

    await sheetThumbs
      .filter(elem => elem.getText().then(text => text === 'test:navigation-actions'))
      .first()
      .click();

    await browser.wait(EC.visibilityOf($('#grid')), timeoutTime);
    await browser.wait(EC.invisibilityOf(loadBlocker), timeoutTime);

    await $$('.btn')
      .filter(elem => elem.getText().then(text => text === 'GotoSheet:Last'))
      .first()
      .click();

    await browser.wait(EC.urlContains(targetSheetId), timeoutTime);

  });

  it('should be possible to use button to navigate to the NEXT sheet', async () => {
    const targetSheetId = '36b1f160-b676-4a3e-a753-c5f51a467f90';

    await sheetThumbs
      .filter(elem => elem.getText().then(text => text === 'first'))
      .first()
      .click();

    await browser.wait(EC.visibilityOf($('#grid')), timeoutTime);
    await browser.wait(EC.invisibilityOf(loadBlocker), timeoutTime);

    await $$('.btn')
      .filter(elem => elem.getText().then(text => text === 'GotoNextSheet'))
      .first()
      .click();

    await browser.wait(EC.urlContains(targetSheetId), timeoutTime);

  });

  it('should be possible to use button to navigate to the PREV sheet', async () => {
    const targetSheetId = '392462be-a70b-4f14-a4cd-05a7aab19ed8';

    await sheetThumbs
      .filter(elem => elem.getText().then(text => text === 'second'))
      .first()
      .click();

    await browser.wait(EC.visibilityOf($('#grid')), timeoutTime);
    await browser.wait(EC.invisibilityOf(loadBlocker), timeoutTime);

    await $$('.btn')
      .filter(elem => elem.getText().then(text => text === 'GotoPrevSheet'))
      .first()
      .click();

    await browser.wait(EC.urlContains(targetSheetId), timeoutTime);
  });

  it('should be possible to use button to open a new website (SAME window)', async () => {
    await sheetThumbs
      .filter(elem => elem.getText().then(text => text === 'test:navigation-actions'))
      .first()
      .click();

    await browser.wait(EC.visibilityOf($('#grid')), timeoutTime);
    await browser.wait(EC.invisibilityOf(loadBlocker), timeoutTime);

    await $$('.btn')
      .filter(elem => elem.getText().then(text => text === 'OpenUrl:self'))
      .first()
      .click();

    await browser.wait(EC.urlContains('https://github.com'), timeoutTime);
  });

  it('should be possible to use button to open a new website (NEW window)', async () => {

    await sheetThumbs
      .filter(elem => elem.getText().then(text => text === 'test:navigation-actions'))
      .first()
      .click();

    await browser.wait(EC.visibilityOf($('#grid')), timeoutTime);
    await browser.wait(EC.invisibilityOf(loadBlocker), timeoutTime);

    await $$('.btn')
      .filter(elem => elem.getText().then(text => text === 'OpenUrl:blank'))
      .first()
      .click();

    let handles = await browser.getAllWindowHandles();

    await browser.switchTo().window(handles[1]);
    let newUrl = await browser.getCurrentUrl();
    expect(newUrl).to.contain('https://github.com');
  });

});
