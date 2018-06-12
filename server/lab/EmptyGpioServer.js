var io = require('socket.io');
//const JSONtools = require('./JSONtools.js');

const raspi = require('raspi');
const pwm = require('raspi-pwm');

var gpio = require('rpi-gpio');

class CAMhandler {
  constructor() {
    raspi.init(() => {});
    this.TILT = new pwm.PWM('GPIO12', 50);
    this.PAN = new pwm.PWM('GPIO19', 50);
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

// gpio: 29, 31, 26
class EmptyGpioServer {
  constructor(port) {
    // Basic class variables
    this.io = io();
    this.port = port;
    // Configs
    this.cam = new CAMhandler()
    this.gpiohandler = new GPIOhandler()
    this.configs = {}
    this.led1 = 7;
    this.led2 = 29;
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
    var tmp = new EmptyGpioClienthandler(client, this);
  }
  wink() {
    this.gpiohandler.write(this.led1, 1)
    setTimeout(() => {this.gpiohandler.write(this.led1, 0)}, 1000)
  }
}

class EmptyGpioClienthandler {
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

var server = new EmptyGpioServer(8004)
