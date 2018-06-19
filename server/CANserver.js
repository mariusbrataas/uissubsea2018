// Importing dependencies
var io = require('socket.io');
var clientIO = require('socket.io-client');
var networking = require('simple-ifconfig');
var can = require('socketcan');
const JSONtools = require('./JSONtools.js');

/*
CONTENTS
- Settings
  - GPIOdesignations
- Helper
  - AddControllerConfig
  - simpleCAN (used for testing)
  - Translate motor commands
    - CMD to ID library
    - Decimal to hex with support for negative numbers
    - ID to CMD library
    - Command scaling library
    - Function to prep full message
  - CANclienthandler
  - CANhandler
- Main class
  - CANserver
*/

// Settings
const GPIOdesignations = JSONtools.LoadConfig('GPIOdesignations');

// Helper: AddControllerConfig
function AddControllerConfig(title, config) {
  var configs = JSONtools.LoadConfig('controllerconfigs');
  configs[title] = config;
  JSONtools.SaveConfig('controllerconfigs', configs);
}

// Helper: simpleCAN (used for testing)
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
function prepMotorMsg(id, cmd, value, multiplier) {
  if (multiplier == 0) {multiplier = 0.5}
  var addr = parseInt((cmd2adr[cmd]).concat(id), 16);
  var data = decimalToHexString(Math.round(multiplier*value*scaling[cmd]))
  for (var i = data.length; i < 8; i++) {data = '0'.concat(data)};
  const prepData = data.match(/.{1,2}/g);
  const msg = {
    id: addr,
    data: new Buffer(prepData.map((dat) => {return parseInt(dat, 16)})),
    ext: true
  };
  return msg
};

// Helper: PIDregulator
class PIDregulator {
  constructor(kp, ki, kd) {
    // Constants
    this.kp = kp;
    this.ki = ki;
    this.kd = kd;
    // Error
    this.e = 0.0;
    // Calculations
    this.p = 0.0;
    this.i = 0.0;
    this.d = 0.0;
    this.pid = 0.0;
    // Helper variables
    this.t = (new Date().getTime())/1000;
    // Binding class methods
    this.step = this.step.bind(this);
    this.reset = this.reset.bind(this);
  }
  step(e) {
    var dt = ((new Date().getTime())/1000) - this.t;
    this.p = this.kp * e;
    this.i += this.ki * dt * e;
    this.i = Math.max(-1, Math.min(1, this.i));
    this.d = this.kd * (e - this.e)/dt;
    this.pid = this.p + this.kp * (this.i + this.d);
    this.e = e;
    this.t = (new Date().getTime())/1000;
    return this.pid;
  }
  reset() {
    this.e = 0.0;
    this.p = 0.0;
    this.i = 0.0;
    this.d = 0.0;
    this.pid = 0.0;
    this.t = (new Date().getTime())/1000;
  }
}

// Helper: CANclienthandler
class CANclienthandler {
  constructor(client, topServer) {
    // Basic class variables
    this.client = client;
    this.topServer = topServer;
    this.canhandler = topServer.canhandler;
    this.gpio = topServer.gpio;
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
          JSONtools.SaveConfig('CANconfig', configs.canbus.config);
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
        // Buttons
        this.client.on('Lights on', (btnstate) => {
          if (btnstate) {
            this.gpio.emit('pin', {pin:GPIOdesignations.led1, value:1});
            this.gpio.emit('pin', {pin:GPIOdesignations.led2, value:1});
            this.topServer.io.volatile.emit('downstreamConfigs', this.topServer.configs)
          }
        });
        this.client.on('Lights off', (btnstate) => {
          if (btnstate) {
            this.gpio.emit('pin', {pin:GPIOdesignations.led1, value:0});
            this.gpio.emit('pin', {pin:GPIOdesignations.led2, value:0});
            this.topServer.io.volatile.emit('downstreamConfigs', this.topServer.configs)
          }
        });
        this.client.on('Toggle lights', (btnstate) => {
          if (btnstate) {
            if (this.topServer.lights == 0) {
              this.topServer.lights = 1;
            } else {
              this.topServer.lights = 0;
            }
            this.gpio.emit('pin', {pin:GPIOdesignations.led1, value:this.topServer.lights});
            this.gpio.emit('pin', {pin:GPIOdesignations.led2, value:this.topServer.lights});
            this.topServer.io.volatile.emit('downstreamConfigs', this.topServer.configs)
          }
        });
        this.client.on('Soundbox on', () => {
          this.gpio.emit('pin', {pin:GPIOdesignations.nico, value:1});
          this.topServer.io.volatile.emit('downstreamConfigs', this.topServer.configs)
        });
        this.client.on('Soundbox off', () => {
          this.gpio.emit('pin', {pin:GPIOdesignations.nico, value:0});
          this.topServer.io.volatile.emit('downstreamConfigs', this.topServer.configs)
        });
        this.client.on('Precision on', () => {
          this.topServer.configs.canbus.precision = true;
          this.topServer.configs.canbus.multiplier = this.topServer.configs.canbus.precisionMult;
          this.topServer.io.volatile.emit('downstreamConfigs', this.topServer.configs)
        });
        this.client.on('Precision off', () => {
          this.topServer.configs.canbus.precision = false;
          this.topServer.configs.canbus.multiplier = this.topServer.configs.canbus.normalMult;
          this.topServer.io.volatile.emit('downstreamConfigs', this.topServer.configs)
        });
        this.client.on('Toggle motorcontrollers', (btnstate) => {
          if (btnstate) {
            this.topServer.alexpin = btnstate;
            this.gpio.emit('pin', {pin:GPIOdesignations.alex, value:this.topServer.alexpin});
            this.topServer.io.volatile.emit('downstreamConfigs', this.topServer.configs)
          }
        });
        this.client.on('Camera up', (btnstate) => {
          if (btnstate) {
            this.topServer.camtilt += 0.1;
            this.topServer.camtilt = Math.max(Math.min(1,this.topServer.camtilt),0);
            this.gpio.emit('tilt', this.topServer.camtilt);
          }
        });
        this.client.on('Camera down', (btnstate) => {
          if (btnstate) {
            this.topServer.camtilt -= 0.1;
            this.topServer.camtilt = Math.max(Math.min(1,this.topServer.camtilt),0);
            this.gpio.emit('tilt', this.topServer.camtilt);
          }
        });
        this.client.on('Camera left', (btnstate) => {
          if (btnstate) {
            this.topServer.campan += 0.1;
            this.topServer.campan = Math.max(Math.min(1,this.topServer.campan),0);
            this.gpio.emit('pan', this.topServer.campan);
          }
        });
        this.client.on('Camera right', (btnstate) => {
          if (btnstate) {
            this.topServer.campan -= 0.1;
            this.topServer.campan = Math.max(Math.min(1,this.topServer.campan),0);
            this.gpio.emit('pan', this.topServer.campan);
          }
        });
        this.client.on('Rotate manip right', (btnstate) => {
          if (btnstate) {
            this.canhandler.sendThrusts({'Mrot': 0.7})
          } else {
            this.canhandler.sendThrusts({'Mrot': 0})
          }
        });
        this.client.on('Rotate manip left', (btnstate) => {
          if (btnstate) {
            this.canhandler.sendThrusts({'Mrot': -0.7})
          } else {
            this.canhandler.sendThrusts({'Mrot': 0})
          }
        });
        this.client.on('Grab', (btnstate) => {
          if (btnstate) {
            this.canhandler.sendThrusts({'Mgrab': 0.7})
          } else {
            this.canhandler.sendThrusts({'Mgrab': 0})
          }
        });
        this.client.on('Release', (btnstate) => {
          if (btnstate) {
            this.canhandler.sendThrusts({'Mgrab': -0.7})
          } else {
            this.canhandler.sendThrusts({'Mgrab': 0})
          }
        });
        // Forwarding other GPIO
        this.client.on('gpio', (newdata) => {this.gpio.emit(newdata.cmd, newdata.data)})
      } else {
        this.client.volatile.emit('connectionNotVerified');
      };
    };
  };
};

// Helper: CANhandler
class CANhandler {
  constructor(topServer) {
    // Basic settings
    this.channel = can.createRawChannel('can0', true);
    this.topServer = topServer;
    this.sendCount = 0;
    this.recvCount = 0;
    this.activate = true;
    this.specialMethod = null;
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
    if (this.activate) {
      this.lastSend = new Date();
      if (this.sendCount > 5000) {
        this.activate = false;
        console.log('Start bus reset')
        this.sendCount = 0;
        this.resetBus()
        console.log('End bus reset')
        this.activate = true;
      }
      this.channel.send(msg)
      var tmp = 0;
    }
  };
  recv(msg) {
    this.recvCount++;
    const tmpid = msg.id.toString(16).substring(1);
    if (!(tmpid in this.knownAdrs)) {this.knownAdrs[tmpid] = parseInt(tmpid, 16)}
    if (!(this.specialMethod == null)) {
      this.specialMethod(tmpid, msg)
    }
  };
  sendThrusts(thrusts) {
    const config = this.topServer.configs.canbus;
    var tmp = null;
    const msgs = Object.keys(thrusts).forEach((key) => {
      tmp = config.config[key]
      if (tmp.engage) {
        const msg = prepMotorMsg(tmp.id, config.thrustChanger, thrusts[key] * (tmp.reverse ? -1 : 1), this.topServer.configs.canbus.multiplier);
        this.send(msg)
      }
    })
  }
}

// Main class
class CANserver {
  constructor(port) {
    // Basic class variables
    this.io = io();
    this.gpio = clientIO('http://192.168.1.114:8004')
    this.canhandler = new CANhandler(this);
    this.nclients = 0;
    this.port = port;
    this.camtilt = 0.5;
    this.campan = 0.5;
    this.lights = 0;
    this.alexpin = 0;
    this.sensorRecvAdr = 32;
    this.sensorSendAdr = '32';
    // Configs
    this.configs = {
      canbus: {
        healthy: true,
        active: false,
        thrustChanger: 'set_duty',
        config: JSONtools.LoadConfig('CANconfig'),
        multiplier: 0.5,
        precision: false,
        precisionMult: 0.25,
        normalMult: 0.5,
      },
      powersupply: {
        healthy: false,
        active: false
      },
      sensors: {
        healthy: false,
        active: false
      },
      gpiostatus: {
        led1: {pin:GPIOdesignations.led1, state:0},
        led2: {pin:GPIOdesignations.led2, state:0},
        alex: {pin:GPIOdesignations.alex, state:0},
        nico: {pin:GPIOdesignations.nico, state:0},
      },
      rollregulator: {
        kp: 1,
        ki: 1,
        kd: 1,
      },
      sensordata: {
        pitch: 0.0,
        roll: 0.0,
        tin: 0.0,
        tout: 0.0,
        tw: 0.0,
        d1: 0.0,
        d2: 0.0
      }
    }
    // Regulator
    //this.pid = new PIDregulator(this.configs.rollregulator.kp, this.configs.rollregulator.ki, this.configs.rollregulator.kd)
    //this.pidInterval = setInterval(() => {
    //  this.callForSensordata()
    //}, 100)
    // Binding class methods
    this.handleNewClient = this.handleNewClient.bind(this);
    this.callForSensordata = this.callForSensordata.bind(this);
    this.handleSensorData = this.handleSensorData.bind(this);
    // Binding io event listeners
    this.io.on('connection', (client) => {this.handleNewClient(client)});
    // Startup routines
    this.io.listen(port)
  };
  handleNewClient(client) {
    this.nclients++;
    client.on('disconnect', () => {this.nclients--});
    var tmp = new CANclienthandler(client, this);
  }
  callForSensordata() {
    this.canhandler.activate = false;
    this.canhandler.specialMethod = this.handleSensorData;
    this.canhandler.channel.send({id:this.sensorSendAdr, data:new Buffer([0,0,0,0])});
  }
  handleSensorData(tmpid, msg) {
    if (msg.id == this.sensorRecvAdr) {
      this.canhandler.activate = true;
      this.canhandler.specialMethod = null;
      this.configs.sensordata = {
        pitch: msg.data[0],
        roll: msg.data[1],
        tin: msg.data[2],
        tout: msg.data[3],
        tw: msg.data[4],
        d1: msg.data[5],
        d2: msg.data[6]
      }
      const reg = this.pid.step(Math.sin((msg.data[1]*Math.PI)/180))
      console.log('PID:', reg);
      this.canhandler.sendThrusts({
        frv: Math.max(-1, Math.min(1, reg)),
        arv: Math.max(-1, Math.min(1, reg)),
        flv: - Math.max(-1, Math.min(1, reg)),
        alv: - Math.max(-1, Math.min(1, reg)),
      })
    }
  }
}


var server = new CANserver(8000)
