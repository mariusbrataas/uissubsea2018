// e -> translate button -> config -> designation -> action

export default function TranslateToAction(act, config, sock, newstate) {
  switch (act) {
    case 'Grab':
      sock.emit('grab', newstate)
      console.log(act)
      break;
    case 'Release':
      sock.emit('release', newstate)
      console.log(act)
      break;
    case 'Rotate manip right':
      sock.emit('rotate_manip_right', newstate)
      console.log(act)
      break;
    case 'Rotate manip left':
      sock.emit('rotate_manip_left', newstate)
      console.log(act)
      break;
    case 'Toggle lights':
      sock.emit('toggle_lights', newstate)
      console.log(act)
      break;
    case 'Lights on':
      sock.emit('lights_on', newstate)
      console.log(act)
      break;
    case 'Lights off':
      sock.emit('lights_off', newstate)
      console.log(act)
      break;
    case 'Engage auto depth':
      sock.emit('engage_auto_depth', newstate)
      console.log(act)
      break;
    case 'Disengage auto depth':
      sock.emit('disengage_auto_depth', newstate)
      console.log(act)
      break;
    case 'Engage auto level':
      sock.emit('engage_auto_level', newstate)
      console.log(act)
      break;
    case 'Disengage auto level':
      sock.emit('rotate_manip_right', newstate)
      console.log(act)
      break;
    case 'Camera up':
      sock.emit('rotate_manip_right', newstate)
      console.log(act)
      break;
    case 'Camera down':
      sock.emit('rotate_manip_right', newstate)
      console.log(act)
      break;
    case 'Camera left':
      sock.emit('rotate_manip_right', newstate)
      console.log(act)
      break;
    case 'Camera right':
      sock.emit('rotate_manip_right', newstate)
      console.log(act)
      break;
    default: console.log('Default')
  }
}
