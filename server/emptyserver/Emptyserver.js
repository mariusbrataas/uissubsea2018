var io = require('socket.io');
const fs = require('fs');

function LoadControllerConfigs() {
  return JSON.parse(fs.readFileSync('controllerconfigs.json'));
}

function AddControllerConfig(title, config) {
  var configs = LoadControllerConfigs();
  configs[title] = config;
  fs.writeFileSync('controllerconfigs.json', JSON.stringify(configs, null, 4))
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
        active: false
      },
      motorcontrollers: {
        healthy: false,
        active: false,
        ids: {
          flv: {title:'Front Left Vertical',    id:0, engage:false, status:{}}, // Front Left Vertical
          frv: {title:'Front Right Vertical',   id:1, engage:false, status:{}}, // Front Right Vertical
          alv: {title:'Aft Left Vertical',      id:2, engage:false, status:{}}, // Aft Left Vertical
          arv: {title:'Aft Right Vertical',     id:3, engage:false, status:{}}, // Aft Right Vertical
          flh: {title:'Front Left Horizontal',  id:4, engage:false, status:{}}, // Front Left Horizontal
          frh: {title:'Front Right Horizontal', id:5, engage:false, status:{}}, // Front Right Horizontal
          alh: {title:'Aft Left Horizontal',    id:6, engage:false, status:{}}, // Aft Left Horizontal
          arh: {title:'Aft Right Horizontal',   id:7, engage:false, status:{}}, // Aft Right Horizontal
        }
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
    this.controllerconfigs = LoadControllerConfigs();
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
          this.controllerconfigs = LoadControllerConfigs();
          this.topServer.io.emit('loadControllerConfigs', this.controllerconfigs)
        })
      } else {
        this.client.emit('connectionNotVerified');
      };
    };
  };
};

var server = new Emptyserver(8000)
