var request = require('request');

function loadSite(site, cb) {
  request(site, function (error, response, body) {
    cb(body);
  });
};

function getField(body, name){
  var tmp = body.substring(body.indexOf(name), body.length)
  tmp = tmp.substring(tmp.indexOf('=')+1, tmp.length)
  var testc = '0';
  var testi = 0;
  while ('.-0123456789'.includes(testc)) {
    testi++;
    testc = tmp[testi]
  }
  return tmp.substring(0, testi)
}

function getFields(body) {
  var data = {'Voltage':null, 'Xangle':null, 'Yangle':null, 'Count':null}
  Object.keys(data).map((key) => {data[key] = 1.0*getField(body, key)})
  return data
}

function getData(body) {
  var tmp = body.substring(body.indexOf('DATA'), body.length)
  var testc = 'a';
  var testi = 0;
  while (!('.-0123456789'.includes(testc))) {
    testi++;
    testc = tmp[testi];
  }
  tmp = tmp.substring(testi, tmp.length);
  testi = 0;
  testc = 0;
  while (testc < 15) {
    if (tmp[testi] == ',') {
      testc++;
    }
    testi++;
  }
  testc = 'a';
  testi += 5;
  tmp = tmp.substring(0, testi)
  while (!('.-0123456789'.includes(testc))) {
    testi--;
    testc = tmp[testi];
  }
  tmp = tmp.substring(0, testi+1)
  var data = tmp.split(',').map((string) => {
    return 1.0*string.replace(/\s/g, '')
  })
  return data
}

function getAll(body) {
  var data = getFields(body);
  data['DATA'] = getData(body);
  data['body'] = body;
  return data
}

loadSite('http://localhost:3000', getAll)
