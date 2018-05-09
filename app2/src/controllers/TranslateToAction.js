// e -> translate button -> config -> designation -> action

export default function TranslateToAction(act, config, sock) {
  switch (act) {
    case 'Grab':
      console.log(act)
      break;
    case 'Release':
      console.log(act)
      break;
    case 'Rotate manip right':
      console.log(act)
      break;
    case 'Rotate manip left':
      console.log(act)
      break;
    case 'Toggle lights':
      console.log(act)
      break;
    case 'Lights on':
      console.log(act)
      break;
    case 'Lights off':
      console.log(act)
      break;
    case 'Engage auto depth':
      console.log(act)
      break;
    case 'Disengage auto depth':
      console.log(act)
      break;
    case 'Engage auto level':
      console.log(act)
      break;
    case 'Disengage auto level':
      console.log(act)
      break;
    case 'Camera up':
      console.log(act)
      break;
    case 'Camera down':
      console.log(act)
      break;
    case 'Camera left':
      console.log(act)
      break;
    case 'Camera right':
      console.log(act)
      break;
    default: console.log('Default')
  }
}
