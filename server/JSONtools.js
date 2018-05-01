var fs = require('fs');

export function writeJSON(data, filename, path) {
  if (path) {
    if (!fs.existsSync(path)){
      fs.mkdirSync(path);
    }
  }
  fs.writeFileSync(path.concat(filename).concat('.json'), JSON.stringify(data));
}

export function readJSON(filename, path) {
  if (!path) {path = ''}
  return JSON.parse(fs.readFileSync(path.concat(filename).concat('.json'), (err, content) => {if (err) {console.log(err)}}));
}
