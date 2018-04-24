var io = require('socket.io');
var can = require('socketcan');

class ROVserver {
  constructor(port) {
    // Basic class variables
    this.io = io();
    this.nclients = 0;
    this.port = port;
    this.canhandler = new CANhandler();
    // Settings library
    this.settingsdata = {
      activateCAN: false,
      save_sensordata: false,
      save_candata: false
    };
    // Binding class methods
    this.handleNewClient = this.handleNewClient.bind(this);
    // Binding io event listeners
    this.io.on('connection', (client) => {this.handleNewClient(client)});
    // Startup routines
    this.io.listen(port)
  };
  handleNewClient(client) {
    console.log('New connection');
    this.nclients++;
    client.on('disconnect', () => {this.nclients--});
    client.on('pullHeartbeat', () => {client.emit('heartbeat', [new Date(), this.nclients])});
    client.on('pushCan', (value) => {this.canhandler.sendMotorMsg('01', 'set_duty', value)});
  }
}

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

var adr2cmd = {};
Object.keys(cmd2adr).map((cmd) => {adr2cmd[cmd2adr[cmd]] = cmd});

const scaling = {
  'set_duty':100000,
  'set_current':1000,
  'set_current_brake':1000,
  'set_rpm':1,
  'set_pos':1000000
};

function prepMotorMsg(id, cmd, value) {
  var addr = parseInt((cmd2adr[cmd]).concat(id), 16);
  var data = Math.round(value*scaling[cmd]).toString(16);
  for (var i = data.length; i < 8; i++) {data = '0'.concat(data)};
  const prepData = data.match(/.{1,2}/g);
  const msg = {
    id: addr,
    data: new Buffer(prepData.map((dat) => {return parseInt(dat, 16)})),
    ext: true
  };
  return msg
};

var channel = can.createRawChannel('can0', true);
channel.start();

class CANhandler {
  constructor() {
    // Basic class variables
    this.sendMotorMsg = this.sendMotorMsg.bind(this);
  };
  sendMotorMsg(id, cmd, value) {
    const msg = prepMotorMsg(id, cmd, value);
    console.log(msg);
    return channel.send(msg);
  }
}

var server = new ROVserver(8000)
