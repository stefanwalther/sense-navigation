const fs = require('fs');
const path = require('path');

class CleanJsonFa {
  constructor() {
    this.fileName = 'icons-fa.json';
  }

  run() {
    let newStructure = {icons: []};
    let origContent = fs.readFileSync(path.join(__dirname, './../src/lib/data', this.fileName));
    let iconsOrig = JSON.parse(origContent).icons;
    iconsOrig.forEach(icon => {
      newStructure.icons.push({
        name: icon.name,
        id: icon.id
      });
    });
    fs.writeFileSync(path.join(__dirname, './../src/lib/data', 'mod_' + this.fileName), JSON.stringify(newStructure));

  }
}

const clean = new CleanJsonFa();
clean.run();
