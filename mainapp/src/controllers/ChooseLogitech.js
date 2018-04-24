//Library
const translateLogitech = {
  'button': {
    0: 1,
    1: 2,
    2: 3,
    3: 4,
    4: 5,
    5: 6,
    6: 7,
    7: 8,
    8: 9,
    9: 10,
    10: 11,
    11: 12
  },
  'axis': {
    'lr': 0
  }
}

// Code
function chooseLogitechDesignation(e, data, sock, inptype) {
  const designation = data.indexDesignations[e.detail.gamepad.index];
  switch(inptype) {
    case 'button':
      switch(designation) {
        case 'Thrusters':
          translateLogitechButtonThrusters(e, data, sock)
          break;
        case 'Manipulator':
          translateLogitechButtonManipulator(e, data, sock)
          break;
        case 'Camera':
          translateLogitechButtonCamera(e, data, sock)
          break;
        default:
          console.log('Default logitech button')
      }
      break;
    case 'axis':
      switch(designation) {
        case 'Thrusters':
          translateLogitechAxisThrusters(e, data, sock)
          break;
        case 'Manipulator':
          translateLogitechAxisManipulator(e, data, sock)
          break;
        case 'Camera':
          translateLogitechAxisCamera(e, data, sock)
          break;
        default:
          console.log('Default logitech axis')
      }
      break;
    default:
      console.log('Default');
  }
}

function translateLogitechAxisThrusters(e, data, sock) {
}
function translateLogitechAxisManipulator(e, data, sock) {

}
function translateLogitechAxisCamera(e, data, sock) {

}

function translateLogitechButtonThrusters(e, data, sock) {
  const axes = e.detail.gamepad.axes;
  console.log([axes[9]])
  if (e.detail.pressed) {
    //console.log('Logitech button thrusters: ', translateLogitech.button[e.detail.index])
    switch (translateLogitech.button[e.detail.index]) {
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
      case 6:
        break;
      case 7:
        break;
      case 8:
        break;
      case 9:
        break;
      case 10:
        break;
      case 11:
        break;
      case 12:
        break;
      default:
        console.log('Default logitech button thrusters')
    }
  }
}
function translateLogitechButtonManipulator(e, data, sock) {
  if (e.detail.pressed) {
    console.log('Logitech button manipulator: ', translateLogitech.button[e.detail.index])
    switch (translateLogitech.button[e.detail.index]) {
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
      case 6:
        break;
      case 7:
        break;
      case 8:
        break;
      case 9:
        break;
      case 10:
        break;
      case 11:
        break;
      case 12:
        break;
      default:
        console.log('Default logitech button manipulator')
    }
  }
}
function translateLogitechButtonCamera(e, data, sock) {
  if (e.detail.pressed) {
    console.log('Logitech button camera: ', translateLogitech.button[e.detail.index])
    switch (translateLogitech.button[e.detail.index]) {
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
      case 6:
        break;
      case 7:
        break;
      case 8:
        break;
      case 9:
        break;
      case 10:
        break;
      case 11:
        break;
      case 12:
        break;
      default:
        console.log('Default logitech button camera')
    }
  }
}

export default chooseLogitechDesignation;
