var io = require('socket.io');
const JSONtools = require('../storage/JSONtools.js');

var networking = require('simple-ifconfig');
var can = require('socketcan');

function AddControllerConfig(title, config) {
  var configs = JSONtools.LoadConfig('controllerconfigs');
  configs[title] = config;
  JSONtools.SaveConfig('controllerconfigs', configs);
}

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
    if (this.sendCount > 100) {
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

class CANserver {
  constructor(port) {
    // Basic class variables
    this.io = io();
    this.canhandler = new CANhandler(this);
    this.nclients = 0;
    this.port = port;
    // Configs
    this.configs = {
      canbus: {
        healthy: true,
        active: false,
        thrustChanger: 'set_duty',
        config: JSONtools.LoadConfig('CANconfig')
      },
      powersupply: {
        healthy: false,
        active: false
      },
      sensors: {
        healthy: false,
        active: false
      }
    }
    // Binding class methods
    this.handleNewClient = this.handleNewClient.bind(this);
    // Binding io event listeners
    this.io.on('connection', (client) => {this.handleNewClient(client)});
    // Startup routines
    this.io.listen(port)
    console.log('Server listening on port', port)
  };
  handleNewClient(client) {
    console.log('New connection');
    this.nclients++;
    client.on('disconnect', () => {this.nclients--});
    var tmp = new CANclienthandler(client, this);
  }
}

class CANclienthandler {
  constructor(client, topServer) {
    // Basic class variables
    this.client = client;
    this.topServer = topServer;
    this.canhandler = topServer.canhandler;
    this.isVerified = false;
    // Binding class methods
    this.handleVerification = this.handleVerification.bind(this);
    // Controller configs
    this.controllerconfigs = JSONtools.LoadConfig('controllerconfigs');
    // Binding client event listeners
    this.client.on('verifyMe', (passwd) => {this.handleVerification(passwd)});
    // Startup routines
    this.client.emit('downstreamConfigs', this.topServer.configs)
    this.client.emit('loadControllerConfigs', this.controllerconfigs)
  };
  handleVerification(passwd) {
    if (this.isVerified) {
      this.client.volatile.emit('connectionVerified')
    } else {
      if (passwd == 'linaro') {
        // Binding defaults for verified clients
        this.client.volatile.emit('connectionVerified');
        this.isVerified = true;
        this.client.on('upstreamConfigs', (configs) => {
          this.topServer.configs = configs;
          this.topServer.io.volatile.emit('downstreamConfigs', this.topServer.configs)
        })
        this.client.on('saveControllerConfig', (data) => {
          AddControllerConfig(data.title, data.config);
          this.controllerconfigs = JSONtools.LoadConfig('controllerconfigs');
          this.topServer.io.volatile.emit('loadControllerConfigs', this.controllerconfigs)
        })
        // Binding CAN-specific listeners
        this.client.on('pushCAN', (msg) => {this.canhandler.send(msg)});
        this.client.on('pushThrusts', (thrusts) => {
          this.canhandler.sendThrusts(thrusts)
        });
      } else {
        this.client.volatile.emit('connectionNotVerified');
      };
    };
  };
};





class CANhandler {
  constructor(topServer) {
    // Basic settings
    this.channel = can.createRawChannel('can0', true);
    this.topServer = topServer;
    this.sendCount = 0;
    this.recvCount = 0;
    this.ready = true;
    this.netinfo = new networking.NetworkInfo();
    this.knownAdrs = {}
    this.lastSend = new Date();
    // Binding class methods
    this.send = this.send.bind(this);
    this.recv = this.recv.bind(this);
    this.sendThrusts = this.sendThrusts.bind(this);
    this.resetBus = this.resetBus.bind(this);
    // Binding channel event listeners
    this.channel.addListener("onMessage", (msg) => {this.recv(msg)});
    // Startup routines
    this.channel.start()
  };
  resetBus() {
    this.netinfo.applySettings('can0', {active:false});
    this.netinfo.applySettings('can0', {active:true});
  }
  send(msg) {
    this.lastSend = new Date();
    if (this.sendCount > 1000) {
      console.log('Start bus reset')
      this.sendCount = 0;
      this.resetBus()
      console.log('End bus reset')
    }
    this.channel.send(msg)
    var tmp = 0;
  };
  recv(msg) {
    this.recvCount++;
    const tmpid = msg.id.toString(16).substring(1);
    if (!(tmpid in this.knownAdrs)) {this.knownAdrs[tmpid] = parseInt(tmpid, 16)}
  };
  sendThrusts(thrusts) {
    const config = this.topServer.configs.canbus;
    const msgs = Object.keys(thrusts).forEach((key) => {
      if (config.config[key].engage) {
        const msg = prepMotorMsg(config.config[key].id, config.thrustChanger, thrusts[key]);
        this.send(msg)
      }
    })
  }
}


var server = new CANserver(8000)
