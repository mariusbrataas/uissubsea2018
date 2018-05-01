var can = require('socketcan');

class CANhandler {
  constructor() {
    // Basic settings
    this.channel = can.createRawChannel('can0', true);
    this.activations = {
      save_candata: false
    };
    // Binding class methods
    this.sendCAN = this.sendCAN.bind(this);
    this.recvCAN = this.recvCAN.bind(this);
    // Binding channel event listeners
    this.channel.addListener("onMessage", (msg) => {this.recvCAN(msg)});
    // Startup routines
    this.channel.start()
  };
  sendCAN(msg) {return channel.send(msg)};
  recvCAN(msg) {
    console.log(msg);
  };
}

export default CANhandler
