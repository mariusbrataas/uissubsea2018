var io = require('socket.io');
const JSONtools = require('./JSONtools.js');

class Emptyserver {
  constructor(port) {
    // Basic class variables
    this.io = io();
    this.nclients = 0;
    this.port = port;
    // Configs
    this.configs = {
      canbus: {
        healthy: true,
        active: true,
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
    this.nclients++;
    client.on('disconnect', () => {this.nclients--});
    var tmp = new Emptyclienthandler(client, this);
  }
}

class Emptyclienthandler {
  constructor(client, topServer) {
    // Basic class variables
    this.client = client;
    this.topServer = topServer;
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
      } else {
        this.client.volatile.emit('connectionNotVerified');
      };
    };
  };
};



const raspi = require('raspi');
const pwm = require('raspi-pwm');

class PWMhandler {
  constructor() {
    raspi.init(() => {});
    this.pins = {
      LED1: new pwm.PWM('GPIO12', 200),
      LED2: new pwm.PWM('GPIO13', 200),
      TILT: new pwm.PWM('GPIO18', 50),
      PAN:  new pwm.PWM('GPIO19', 50),
    };
    // Binding class methods
    this.tilt = this.tilt.bind(this);
    this.pan = this.pan.bind(this);
    this.dim1 = this.dim1.bind(this);
    this.dim2 = this.dim2.bind(this);
  }
  tilt(val) {this.pins.TILT.write(val)}
  pan(val)  {this.pins.PAN.write(val)}
  dim1(val) {this.pins.LED1.write(val)}
  dim2(val) {this.pins.LED2.write(val)}
}




var duty = 0.5
var t1 = new Date().getTime()
while (true) {

}



var io = require('socket.io')
class pwm {
  constructor(freq) {
    this.freq = freq;
    this.period = 1/freq;
    this.duty = 0.5;
    this.dutytime = this.period * this.duty * 1000;
    this.int = null;
    this.startPwm = this.startPwm.bind(this)
    this.stop = this.stop.bind(this)
    this.io = io()
    this.io.listen(8000)
  }
  startPwm(duty) {
    this.duty = duty;
    this.dutytime = this.period * this.duty * 1000;
    var tmp = 0;
    var t1 = null
    this.int = setInterval(() => {
      sense.setPixel(0, 7, 255, 255, 255)
      while (t1 + this.dutytime > new Date().getTime()) {tmp = 0}
      sense.setPixel(0, 7, 255, 255, 255)
    }, this.period)
  }
  stop() {
    clearInterval(this.int);
    this.int = null;
  }
}


function setLed(x, y, r, g, b) {
  sense.setPixel(x, y, [Math.round(r),Math.round(g),Math.round(b)]);
}
function setAll(r,g,b) {
  for (var x = 0; x <= 7; x++) {
    for (var y = 0; y <= 7; y++) {
      setLed(x, y, r, g, b)
    }
  }
}
const sense = require("sense-hat-led");

class LED {
  constructor() {
    this.inter = null
    this.setLed = this.setLed.bind(this)
    this.setAll = this.setAll.bind(this)
    this.flashBlue = this.flashBlue.bind(this)
    this.stop = this.stop.bind(this)
    this.slide = this.slide.bind(this)
    this.contSlide = this.contSlide.bind(this)
    this.setWithTime = this.setWithTime.bind(this)
  }
  setLed(x, y, r, g, b) {
    sense.setPixel(x, y, [Math.round(r),Math.round(g),Math.round(b)]);
  }
  setAll(r,g,b) {
    for (var x = 0; x <= 7; x++) {
      for (var y = 0; y <= 7; y++) {
        this.setLed(x, y, r, g, b)
      }
    }
  }
  flashBlue(d) {
    if (!(this.inter)) {
      this.setAll(0, 150, 255)
      this.inter = setInterval(() => {
        this.setAll(0, 150, 255)
        setTimeout(() => {
          this.setAll(0,0,0)
        }, Math.round(d/2))
      }, d)
    }
  }
  stop() {
    clearInterval(this.inter)
    this.inter = null
    this.setAll(0,0,0)
  }
  contSlide(row, d, r, g, b) {
    this.inter = setInterval(() => {
      this.slide(row, d, r, g, b)
    },d)
  }
  setWithTime(x, y, d, r, g, b) {
    setTimeout(() => {this.setLed(x, y, r, g, b)}, d)
  }
  slide(row, d, r, g, b) {
    const steps = 32
    for (var i = 0; i <= 7; i++) {this.setWithTime(row, i, i*(d/steps), r, g, b)}
    for (var i = 0; i <= 7; i++) {this.setWithTime(row, i, (8+i)*(d/steps), 0, 0, 0)}
    for (var i = 0; i <= 7; i++) {this.setWithTime(row+1, (7-i), (16+i)*(d/steps), r, g, b)}
    for (var i = 0; i <= 7; i++) {this.setWithTime(row+1, (7-i), (24+i)*(d/steps), 0, 0, 0)}
  }
}

var l = new LED()
l.contSlide(0, 750, 0, 255, 255)

var server = new ROVserver(8000)
