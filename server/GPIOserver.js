var io = require('socket.io');
import GPIOhandler from './src/GPIOhandler.js';
import GPIOclienthandler from './src/GPIOclienthandler.js';

class GPIOserver {
  constructor(port) {
    // Basic class variables
    this.io = io();
    this.gpiohandler = new GPIOhandler();
    this.nclients = 0;
    this.port = port;
    // Activations library
    this.activations = {
      gpio: false,
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
    var tmp = new GPIOclienthandler(client, this);
  }
}

var server = new ROVserver(8000)
