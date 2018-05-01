class CANclienthandler {
  constructor(client, topServer) {
    // Basic class variables
    this.client = client;
    this.topServer = topServer;
    this.canhandler = topServer.canhandler;
    this.isVerified = false;
    // Binding class methods
    this.handleVerification = this.handleVerification.bind(this);
    // Binding client event listeners
    this.client.on('verifyMe', (passwd) => {this.handleVerification(passwd)});
    // Startup routines
  };
  handleVerification(passwd) {
    if (passwd == 'Ingeniorkunst1') {
      this.client.emit('connectionVerified');
      this.isVerified = true;
      // Binding client event listeners
      this.client.on('pullHeartbeat', () => {client.emit('heartbeat', [new Date(), this.topServer.nclients])});
      this.client.on('pushCan', (msg) => {this.canhandler.sendCAN(msg)});
      this.client.on('pushMultipleCan', (msgs) {msgs.map((msg) => {this.canhandler.sendCAN(msg)})});
    } else {
      this.client.emit('connectionNotVerified'):
    };
  };
};

export default CANclienthandler
