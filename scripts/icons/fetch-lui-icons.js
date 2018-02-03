const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

function makeName(id) {
  let s = id.replace('-', ' ');
  return cap(s);
}

function cap(str) {
  return str.replace(/([a-z])/, function (match, value) {
    return value.toUpperCase();
  });
}

request('https://qlik-oss.github.io/leonardo-ui/icons.html', function (error, response, html) {
  if (!error && response.statusCode === 200) {
    const $ = cheerio.load(html);
    let result = {icons: []};
    let body = $('.icon-box .icon-example');
    $(body).each((i, elem) => {
      let eId = $(elem).find('span').attr('class')
      let id = eId.substr(eId.indexOf('--') + 2);
      let name = makeName(id);
      result.icons.push({id, name});
    });
    console.log('Num of icons: ', result.icons.length);
    fs.writeFileSync(path.join(__dirname, 'icons-lui.json'), JSON.stringify(result));
  }
});
