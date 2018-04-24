var can = require('socketcan');

class CANhandler {
  constructor() {
    // Basic settings
    this.channel = can.createRawChannel('can0', true);
    this.activations = {
      save_candata: false
    };
    // Basic class variables
    this.sendMotorMsg = this.sendMotorMsg.bind(this);
    // Startup routines
    this.channel.start()
  };
  sendCanMsg(msg) {return channel.send(msg)};
}

export default CANhandler
