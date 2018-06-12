// Importing dependencies
var io = require('socket.io');
var gpio = require('rpi-gpio');
const raspi = require('raspi');
const pwm = require('raspi-pwm');
const JSONtools = require('./JSONtools.js');

/*
CONTENTS
- Settings
  - GPIOdesignations
- Helper
  - CAMhandler
  - GPIOhandler
  - GpioClientHandler
- Main class
  - GpioServer
*/

// Settings
const GPIOdesignations = JSONtools.LoadConfig('GPIOdesignations');

// Helper: CAMhandler
class CAMhandler {
  constructor() {
    raspi.init(() => {});
    this.TILT = new pwm.PWM(GPIOdesignations.tilt, 50);
    this.PAN = new pwm.PWM(GPIOdesignations.pan, 50);
    // Binding class methods
    this.tilt = this.tilt.bind(this);
    this.pan = this.pan.bind(this);
  }
  tilt(val) {this.TILT.write(0.03+0.095*val)}
  pan(val)  {this.PAN.write(0.04+0.07*val)}
}

// Helper: GPIOhandler
class GPIOhandler {
  constructor() {
    this.pins = {}
    this.write = this.write.bind(this)
  }
  write(pin, value) {
    if (!(pin in this.pins)) {
      gpio.setup(pin, gpio.DIR_OUT);
      this.pins[pin] = null;
      try {gpio.write(pin, value)} catch(err) {}
      setTimeout(() => {
        gpio.write(pin, value);
      }, 250)
    } else {
      this.pins[pin] = value;
      gpio.write(pin, value, () => {})
    }
  }
}

// Helper: GpioClientHandler
class GpioClienthandler {
  constructor(client, topServer) {
    // Basic class variables
    this.client = client;
    this.topServer = topServer;
    this.cam = topServer.cam;
    // Binding client event listeners
    this.client.on('tilt', (value) => {this.cam.tilt(value)})
    this.client.on('pan', (value) => {this.cam.pan(value)})
    this.client.on('pin', (data) => {this.topServer.gpiohandler.write(data.pin, data.value)})
    this.topServer.wink()
  };
};

// Main class
class GpioServer {
  constructor(port) {
    // Basic class variables
    this.io = io();
    this.port = port;
    // Configs
    this.cam = new CAMhandler()
    this.gpiohandler = new GPIOhandler()
    this.configs = {}
    this.led1 = GPIOdesignations.led1;
    this.led2 = GPIOdesignations.led2;
    // Binding class methods
    this.handleNewClient = this.handleNewClient.bind(this);
    this.wink = this.wink.bind(this)
    // Binding io event listeners
    this.io.on('connection', (client) => {this.handleNewClient(client)});
    // Startup routines
    this.io.listen(port)
    console.log('Server listening on port', port)
  };
  handleNewClient(client) {
    this.nclients++;
    console.log('New connection')
    client.on('disconnect', () => {this.nclients--});
    var tmp = new GpioClienthandler(client, this);
  }
  wink() {
    this.gpiohandler.write(this.led1, 1)
    setTimeout(() => {this.gpiohandler.write(this.led1, 0)}, 1000)
  }
}

var server = new GpioServer(8004)
