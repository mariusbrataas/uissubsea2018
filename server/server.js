var io = require('socket.io');
import CANhandler from './src/Canhandler.js';
import Clienthandler from './src/Clienthandler.js';

class ROVserver {
  constructor(port) {
    // Basic class variables
    this.io = io();
    this.nclients = 0;
    this.port = port;
    this.canhandler = new CANhandler();
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
    var tmp = new Clienthandler(client, this);
  }
}

var server = new ROVserver(8000)
