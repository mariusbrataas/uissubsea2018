var fs = require('fs');

module.exports = {
  "LoadConfig": (configname) => {
    return JSON.parse(fs.readFileSync('./storage/'.concat(configname).concat('.json')));
  },
  "SaveConfig": (configname, data) => {
    fs.writeFileSync('./storage/'.concat(configname).concat('.json'), JSON.stringify(data, null, 4))
  }
}
