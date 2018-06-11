var io = require('socket.io');
var clientIO = require('socket.io-client');

const JSONtools = require('./JSONtools.js');

class Emptyserver {
  constructor(port) {
    // Basic class variables
    this.io = io();
    this.gpio = clientIO('http://192.168.1.114:8004')
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
    this.gpio = topServer.gpio;
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
        this.client.on('gpio', (newdata) => {this.gpio.emit(newdata.cmd, newdata.data)})
      } else {
        this.client.volatile.emit('connectionNotVerified');
      };
    };
  };
};

var server = new Emptyserver(8000)
