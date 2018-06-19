var can = require('socketcan');
var networking = require('simple-ifconfig');

class simpleCAN {
  constructor() {
    // Basic settings
    this.channel = can.createRawChannel('can0', true);
    this.recvCount = 0;
    this.sendCount = 0;
    this.netinfo = new networking.NetworkInfo();
    this.lastSend = new Date();
    this.queue = [];
    // Binding class methods
    this.send = this.send.bind(this);
    this.recv = this.recv.bind(this);
    this.sendThrust = this.sendThrust.bind(this);
    this.test = this.test.bind(this);
    this.resetBus = this.resetBus.bind(this);
    // Binding channel event listeners
    this.channel.addListener("onMessage", (msg) => {this.recv(msg)});
    // Startup routines
    this.channel.start()
    this.knownAdrs = {};
  };
  resetBus() {
    this.netinfo.applySettings('can0', {active:false});
    this.netinfo.applySettings('can0', {active:true});
  };
  send(msg) {
    this.sendCount++;
    this.lastSend = new Date();
    if (this.sendCount > 5000) {
      console.log('Start bus reset')
      this.sendCount = 0;
      this.resetBus()
      console.log('End bus reset')
    }
    this.netinfo.applySettings('can0', {active:true});
    this.channel.send(msg)
    var tmp = 0;
    //while ((new Date() - this.lastSend) < 50) {tmp = 0}
  };
  recv(msg) {
    this.recvCount++;
    const tmpid = msg.id.toString(16).substring(1);
    if (!(tmpid in this.knownAdrs)) {this.knownAdrs[tmpid] = parseInt(tmpid, 16)}
  };
  test() {
    Object.keys(this.knownAdrs).forEach((key) => {
      this.sendThrust(key, 1)
    })
  };
  sendThrust(id, thrust) {
    this.send(prepMotorMsg(id, 'set_duty', thrust))
  };
  stats() {
    console.log(' ')
    console.log('STATS')
    console.log('N received msgs:   ', this.recvCount-this.sendCount)
    console.log('N sent msgs:       ', this.sendCount)
    console.log('N known addresses: ', Object.keys(this.knownAdrs).length)
    console.log('Known addresses: ')
    console.log(this.knownAdrs)
  }
}

// Helper: Translate motor commands
// CMD to ID library
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

// Decimal to hex with support for negative numbers
function decimalToHexString(number) {
  if (number < 0)
  {number = 0xFFFFFFFF + number + 1;}
  var val = number.toString(16).toUpperCase();
  return val
}

// ID to CMD library
var adr2cmd = {};
Object.keys(cmd2adr).map((cmd) => {adr2cmd[cmd2adr[cmd]] = cmd});

// Command scaling library
const scaling = {
  'set_duty':100000,
  'set_current':1000,
  'set_current_brake':1000,
  'set_rpm':1,
  'set_pos':1000000
}

// Function to prep full message
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

var c = new simpleCAN()
var lastMsg = null
c.channel.addListener("onMessage", (msg) => {if (msg.id == 32){lastMsg = msg}});
