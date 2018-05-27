var io = require('socket.io');
const fs = require('fs');
const JSONtools = require('../storage/JSONtools.js');

function AddControllerConfig(title, config) {
  var configs = JSONtools.LoadConfig('controllerconfigs');
  configs[title] = config;
  JSONtools.SaveConfig('controllerconfigs', configs);
}

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
      this.client.emit('connectionVerified')
    } else {
      if (passwd == 'linaro') {
        this.client.emit('connectionVerified');
        this.isVerified = true;
        this.client.on('upstreamConfigs', (configs) => {
          this.topServer.configs = configs;
          this.topServer.io.emit('downstreamConfigs', this.topServer.configs)
        })
        this.client.on('saveControllerConfig', (data) => {
          AddControllerConfig(data.title, data.config);
          this.controllerconfigs = JSONtools.LoadConfig('controllerconfigs');
          this.topServer.io.emit('loadControllerConfigs', this.controllerconfigs)
        })
      } else {
        this.client.emit('connectionNotVerified');
      };
    };
  };
};

var server = new Emptyserver(8000)
