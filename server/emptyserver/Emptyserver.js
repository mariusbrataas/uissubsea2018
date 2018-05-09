var io = require('socket.io');

class Emptyserver {
  constructor(port) {
    // Basic class variables
    this.io = io();
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
    console.log('Listening on port ', port)
  };
  handleNewClient(client) {
    console.log('New connection');
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
    // Binding client event listeners
    this.client.on('verifyMe', (passwd) => {this.handleVerification(passwd)});
    // Startup routines
  };
  handleVerification(passwd) {
    if (passwd == 'Ingeniorkunst1') {
      console.log('Verified')
      this.client.emit('connectionVerified');
      this.isVerified = true;
      // Binding client event listeners
      this.client.on('pullHeartbeat', () => {client.emit('heartbeat', [new Date(), this.topServer.nclients])});
    } else {
      console.log('Verification failed')
      this.client.emit('connectionNotVerified');
    };
  };
};

var server = new Emptyserver(8000)
