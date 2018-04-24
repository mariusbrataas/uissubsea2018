// Importing local functions
import {tangentTransfers, sTransfers} from './Transferfunctions.js'
import prepMotorMsg from './CanTranslateMotor.js'

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
      const axes = sTransfers(e.detail.gamepad.axes, 1);
      const thrusts = sTransfers([e.detail.gamepad.buttons[6].value,e.detail.gamepad.buttons[7].value], 1);
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
  sock.emit('pushCan', ['set_duty', thrusts[1]])
  console.log(thrusts[1])
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
        sock.emit('pushCan', ['set_duty', 0.1])
        break;
      case 'rb':
        sock.emit('pushCan', ['set_duty', 1])
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
    if (translateXbox.button[e.detail.index] == 'rb') {sock.emit('pushCan', ['set_duty', 0])}
    if (translateXbox.button[e.detail.index] == 'lb') {sock.emit('pushCan', ['set_duty', 0])}
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
