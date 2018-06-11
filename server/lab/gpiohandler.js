var gpio = require('rpi-gpio');

class GPIOhandler {
  constructor() {
    this.pins = {}
    this.write = this.write.bind(this)
  }
  write(pin, value) {
    if (!(pin in this.pins)) {
      gpio.setup(pin, gpio.DIR_OUT);
      this.pins[pin] = null;
    }
    this.pins[pin] = value;
    gpio.write(pin, value, () => {})
  }
}
