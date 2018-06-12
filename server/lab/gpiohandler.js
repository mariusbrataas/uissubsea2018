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
      try {gpio.write(pin, value)} catch(err) {}
      setTimeout(() => {
        gpio.write(pin, value);
      }, 250)
    } else {
      this.pins[pin] = value;
      gpio.write(pin, value, () => {})
    }
  }
}
