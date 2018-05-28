var can = require('socketcan');

class CANhandler {
  constructor(topServer) {
    // Basic settings
    this.channel = can.createRawChannel('can0', true);
    this.topServer = topServer;
    // Binding class methods
    this.send = this.send.bind(this);
    this.recv = this.recv.bind(this);
    this.sendThrusts = this.sendThrusts.bind(this);
    // Binding channel event listeners
    this.channel.addListener("onMessage", (msg) => {this.recv(msg)});
    // Startup routines
    this.channel.start()
  };
  send(msg) {return channel.send(msg)};
  recv(msg) {
    console.log(msg);
  };
  sendThrusts(thrusts) {
    const config = this.topServer.configs.canbus;
    const msgs = Object.keys(thrusts).map((key, index) => {
      if (config.config[key].engage) {
        const msg = prepMotorMsg(config.config[key].id, config.thrustChanger, thrusts[key]);
        if (config.config[key].id == 12) {this.send(msg)}
      }
    })
  }
}

// Helpers for com with motorcontrollers
const cmd2adr = {
  'set_duty':             '00',
  'set_current':          '01',
  'set_current_brake':    '02',
  'set_rpm':              '03',
  'set_pos':              '04',
  'fill_rx_buffer':       '05',
  'fill_rx_buffer_long':  '06',
  'process_rx_buffer':    '07',
  'process_short_buffer': '08',
  'packet_status':        '09'
};

function decimalToHexString(number)
{
    if (number < 0)
    {
        number = 0xFFFFFFFF + number + 1;
    }

    var val = number.toString(16).toUpperCase();
    return val
}

var adr2cmd = {};
Object.keys(cmd2adr).map((cmd) => {adr2cmd[cmd2adr[cmd]] = cmd});

const scaling = {
  'set_duty':100000,
  'set_current':1000,
  'set_current_brake':1000,
  'set_rpm':1,
  'set_pos':1000000
}

function prepMotorMsg(id, cmd, value) {
  var addr = parseInt((cmd2adr[cmd]).concat(id), 16);
  var data = decimalToHexString(Math.round(value*scaling[cmd]))
  for (var i = data.length; i < 8; i++) {data = '0'.concat(data)};
  const prepData = data.match(/.{1,2}/g);
  const msg = {
    id: addr,
    data: new Buffer(prepData.map((dat) => {return parseInt(dat, 16)})),
    ext: true
  };
  return msg
};

export default CANhandler
