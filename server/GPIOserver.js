var io = require('socket.io');
//const JSONtools = require('./JSONtools.js');

const raspi = require('raspi');
const pwm = require('raspi-pwm');

var gpio = require('rpi-gpio');

const GPIOdesignations = {
  tilt: 'GPIO12', // Pin 32
  pan: 'GPIO19', // Pin 35
  led1: 7, // GPIO4
  led2: 29, // GPIO5
  alex: 26,
  nico: 12,
}

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

// GPIO12, Pin 32: Tilt
// GPIO19, Pin 35: Pan
// GPIO4,  Pin 7: LED
// GPIO5,  Pin 29: LED
// Pin26: Alex
// Pin12: Nico

// gpio: 29, 31, 26, 12
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

var server = new GpioServer(8004)
