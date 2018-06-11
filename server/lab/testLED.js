const sense = require("sense-hat-led");

class LED {
  constructor() {
    this.inter = null
    this.setLed = this.setLed.bind(this)
    this.setAll = this.setAll.bind(this)
    this.flashBlue = this.flashBlue.bind(this)
    this.stop = this.stop.bind(this)
    this.slide = this.slide.bind(this)
    this.contSlide = this.contSlide.bind(this)
    this.setWithTime = this.setWithTime.bind(this)
  }
  setLed(x, y, r, g, b) {
    sense.setPixel(x, y, [Math.round(r),Math.round(g),Math.round(b)]);
  }
  setAll(r,g,b) {
    for (var x = 0; x <= 7; x++) {
      for (var y = 0; y <= 7; y++) {
        this.setLed(x, y, r, g, b)
      }
    }
  }
  flashBlue(d) {
    if (!(this.inter)) {
      this.setAll(0, 150, 255)
      this.inter = setInterval(() => {
        this.setAll(0, 150, 255)
        setTimeout(() => {
          this.setAll(0,0,0)
        }, Math.round(d/2))
      }, d)
    }
  }
  stop() {
    clearInterval(this.inter)
    this.inter = null
    this.setAll(0,0,0)
  }
  contSlide(row, d, r, g, b) {
    if (!(this.inter == null)) {
      this.stop()
    }
    this.inter = setInterval(() => {
      this.slide(row, d, r, g, b)
    },d)
  }
  setWithTime(x, y, d, r, g, b) {
    setTimeout(() => {this.setLed(x, y, r, g, b)}, d)
  }
  slide(rows, d) {
    const steps = 32
    for (var i = 0; i <= 7; i++) {
      rows.map((row) => {this.setWithTime(row, i, i*(d/steps), 0, 255-Math.round(210*i/7), 45+Math.round(210*i/7))})
    }
    for (var i = 0; i <= 7; i++) {
      rows.map((row) => {this.setWithTime(row, i, (8+i)*(d/steps), 0, 0, 0)})
    }
    for (var i = 0; i <= 7; i++) {
      rows.map((row) => {this.setWithTime(row, (7-i), (16+i)*(d/steps), 0, 45+Math.round(210*i/7), 255-Math.round(210*i/7))})
    }
    for (var i = 0; i <= 7; i++) {
      rows.map((row) => {this.setWithTime(row, (7-i), (24+i)*(d/steps), 0, 0, 0)})
    }
  }
}

var l = new LED()
l.contSlide([0,1,2,3,4,5,6,7], 1000)
setTimeout(() => {l.stop()}, 2000)
