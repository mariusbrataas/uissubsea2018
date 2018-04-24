// Local functions
import chooseLogitechDesignation from './ChooseLogitech.js'
import chooseXboxDesignation from './ChooseXbox.js'

// choose cont -> choose designation -> choose btn/ax -> translate -> push
function choosecontroller(e, data, sock, inptype) {
  switch(e.detail.gamepad.id) {
    case 'Xbox 360 Controller (XInput STANDARD GAMEPAD)':
      chooseXboxDesignation(e, data, sock, inptype)
      break;
    case 'Logitech Extreme 3D (Vendor: 046d Product: c215)':
      chooseLogitechDesignation(e, data, sock, inptype)
      break;
    default:
  }
}

export default choosecontroller;
