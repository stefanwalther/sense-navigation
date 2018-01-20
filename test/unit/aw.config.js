'use strict';

module.exports = {
  url: 'http://localhost:9676/test/unit/index.html',
  glob: ['test/unit/*.spec.js'],
  watchGlob: ['src/*.js'],
  'instrument.exclude': [
    '**/*main.js'
  ]
};
