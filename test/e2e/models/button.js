'use strict';

const selectors = {
  buttons: '.btn'
};

class Button {
  constructor(...params) {
    this.btn = null;
    if (params.length) {
      this.get(...params);
    }
  }

  async get(buttonText) {
    await this.areButtonsPresent();
    this.btn = $$(selectors.buttons)
      .filter(elem => elem.getText().then(text => text === buttonText))
      .first();
    return this.btn;
  }

  async areButtonsPresent() {
    // Await browser.sleep(1000); // Todo: This drives me crazy; we urgently need a better, more reliable solution
    return $(selectors.buttons).isPresent();
  }

  async click() {
    await this.btn.click();
  }
}

module.exports = Button;
