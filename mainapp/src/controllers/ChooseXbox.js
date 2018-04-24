// Transfer functions
tangentTransfer = (x,z) => {return Math.pow(Math.abs(x),z)*Math.tan((Math.PI/4)*x)};
tangentTransfers = (X,z) => {return X.map((x) => {return Math.pow(Math.abs(x),z)*Math.tan((Math.PI/4)*x)})};

// Library
const translateXbox = {
  'button': {
    0: 'a',
    1: 'b',
    2: 'x',
    3: 'y',
    4: 'lb',
    5: 'rb',
    8: 'select',
    9: 'menu',
    10: 'ls',
    11: 'rs',
    12: 'up',
    13: 'down',
    14: 'left',
    15: 'right'
  },
  'axis': {
    0: 'llr',
    1: 'lud',
    2: 'rlr',
    3: 'rud'
  }
}

// Code
function chooseXboxDesignation(e, data, sock, inptype) {
  const designation = data.indexDesignations[e.detail.gamepad.index];
  if (inptype == 'button' && (e.detail.index == 6 || e.detail.index == 7)) {inptype='axis'}
  switch(inptype) {
    case 'button':
      switch(designation) {
        case 'Thrusters':
          translateXboxButtonThrusters(e, data, sock)
          break;
        case 'Manipulator':
          translateXboxButtonManipulator(e, data, sock)
          break;
        case 'Camera':
          translateXboxButtonCamera(e, data, sock)
          break;
        default:
      }
      break;
    case 'axis':
      const axes = tangentTransfers(e.detail.gamepad.axes);
      const thrusts = tangentTransfers([e.detail.buttons[6],e.detail.buttons[7]]);
      switch(designation) {
        case 'Thrusters':
          translateXboxAxisThrusters(e, data, sock, axes, thrusts)
          break;
        case 'Manipulator':
          translateXboxAxisManipulator(e, data, sock, axes, thrusts)
          break;
        case 'Camera':
          translateXboxAxisCamera(e, data, sock, axes, thrusts)
          break;
        default:
      }
      break;
    default:
  }
}

function translateXboxAxisThrusters(e, data, sock, axes, thrusts) {

}
function translateXboxAxisManipulator(e, data, sock, axes, thrusts) {

}
function translateXboxAxisCamera(e, data, sock, axes, thrusts) {

}

function translateXboxButtonThrusters(e, data, sock) {
  //console.log('Xbox button thrusters', translateXbox.button[e.detail.index])
  if (e.detail.pressed) {
    switch (translateXbox.button[e.detail.index]) {
      case 'a':
        break;
      case 'b':
        break;
      case 'x':
        break;
      case 'y':
        break;
      case 'lb':
      sock.emit('pushCan', ['set_current', -7000])
      //sock.emit('pushCan', ['set_rpm', -50000])
        break;
      case 'rb':
        sock.emit('pushCan', ['set_current', 7000])
        //sock.emit('pushCan', ['set_rpm', 50000])
        break;
      case 'select':
        break;
      case 'menu':
        break;
      case 'ls':
        break;
      case 'rs':
        break;
      case 'up':
        break;
      case 'down':
        break;
      case 'left':
        break;
      case 'right':
        break;
      default:
    }
  }
  else {
    if (translateXbox.button[e.detail.index] == 'rb') {sock.emit('pushCan', ['set_rpm', 0])}
    if (translateXbox.button[e.detail.index] == 'lb') {sock.emit('pushCan', ['set_rpm', 0])}
  }
}
function translateXboxButtonManipulator(e, data, sock) {
  if (e.detail.pressed) {
    switch (translateXbox.button[e.detail.index]) {
      case 'a':
        break;
      case 'b':
        break;
      case 'x':
        break;
      case 'y':
        break;
      case 'lb':
        break;
      case 'rb':
        break;
      case 'select':
        break;
      case 'menu':
        break;
      case 'ls':
        break;
      case 'rs':
        break;
      case 'up':
        break;
      case 'down':
        break;
      case 'left':
        break;
      case 'right':
        break;
      default:
    }
  }
}
function translateXboxButtonCamera(e, data, sock) {
  if (e.detail.pressed) {
    switch (translateXbox.button[e.detail.index]) {
      case 'a':
        break;
      case 'b':
        break;
      case 'x':
        break;
      case 'y':
        break;
      case 'lb':
        break;
      case 'rb':
        break;
      case 'select':
        break;
      case 'menu':
        break;
      case 'ls':
        break;
      case 'rs':
        break;
      case 'up':
        break;
      case 'down':
        break;
      case 'left':
        break;
      case 'right':
        break;
      default:
    }
  }
}

export default chooseXboxDesignation;
