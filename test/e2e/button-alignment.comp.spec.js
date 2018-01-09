'use strict';

const AppOverviewPage = require('./models/app-overview');
const timeoutTime = 10000;
const selectors= {
  qvtSheet: '.qvt-sheet'
};

describe('Button Alignment => ', () => {

  xit('should be equal to the taken screenshot', async () => {

    const appOverview = new AppOverviewPage();
    await appOverview.get('sense-navigation_v1x');

    await appOverview.openSheet('Button Alignment');

    await browser.takeImageOf({selector: selectors.qvtSheet});

  });

});
