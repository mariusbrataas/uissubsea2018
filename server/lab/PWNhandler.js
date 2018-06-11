const raspi = require('raspi');
const pwm = require('raspi-pwm');

class PWMhandler {
  constructor() {
    raspi.init(() => {});
    this.TILT: new pwm.PWM('GPIO12', 50);
    this.PAN:  new pwm.PWM('GPIO19', 50);
    // Binding class methods
    this.tilt = this.tilt.bind(this);
    this.pan = this.pan.bind(this);
  }
  tilt(val) {this.TILT.write(0.03+0.095*val)}
  pan(val)  {this.PAN.write(0.04+0.07*val)}
}
