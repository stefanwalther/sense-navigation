const selectors = {
  filterPanes: '.qv-filterpane'
};

class FilterPane {
  constructor(...params) {
    if (params.length) {
      this.get(...params);
    }
  }

  async get(label) {
    // console.log('get filterpane');
    // $('.qv-filterpane').has('h1[title=Dim1]')
    //
  }

}

module.exports = FilterPane;
