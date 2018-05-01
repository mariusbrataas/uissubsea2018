var io = require('socket.io');
import CANhandler from './src/CANhandler.js';
import CANclienthandler from './src/CANclienthandler.js';

class CANserver {
  constructor(port) {
    // Basic class variables
    this.io = io();
    this.canhandler = new CANhandler();
    this.nclients = 0;
    this.port = port;
    // Activations library
    this.activations = {
      can: false,
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
    var tmp = new CANclienthandler(client, this);
  }
}

var server = new ROVserver(8000)
