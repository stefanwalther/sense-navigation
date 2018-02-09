const AppOverviewPage = require('./models/app-overview');
const Button = require('./models/button');
const FilterPane = require('./models/filterpane');
const timeoutTime = 10000;

const selectors = {
  qvtSheet: '.qvt-sheet'
};

describe('ACTIONS', () => {

  beforeEach(async () => {
    const appOverview = new AppOverviewPage();
    await appOverview.get('sense-navigation_v1x');

    await appOverview.openSheet('test:actions');
  });

  xit('do something', async () => {

    const btn = new Button();
    await btn.get('ApplyBookmark');
    await btn.click();

    const filterPane = new FilterPane();
    await filterPane.get('Dim1');
  });
});
