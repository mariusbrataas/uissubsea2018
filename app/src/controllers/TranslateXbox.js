export function sTransfer(x) {
  const val = Math.sin((x*Math.PI)/2)*Math.abs(Math.sin((x*Math.PI)/2));
  if (Math.abs(val) < 0.025) {return 0};
  return val;
};

const index2XboxBtnLib = {
  0: 'A',
  1: 'B',
  2: 'X',
  3: 'Y',
  4: 'LB',
  5: 'RB',
  8: 'SELECT',
  9: 'MENU',
  10: 'LS',
  11: 'RS',
  12: 'UP',
  13: 'DOWN',
  14: 'LEFT',
  15: 'RIGHT'
}

const index2XboxAxisLib = {
  0: 'LLR',
  1: 'LUD',
  2: 'RLR',
  3: 'RUD',
  6: 'LT',
  7: 'RT'
}

export function index2XboxBtn(index) {
  return index2XboxBtnLib[index]
}

export function index2XboxAxis(index) {
  return index2XboxAxisLib[index]
}

export function TranslateXboxAxis (e, config) {
  const rawAxes = {
    LLR: sTransfer(e.detail.gamepad.axes[0]),
    LUD: sTransfer(e.detail.gamepad.axes[1]),
    RLR: sTransfer(e.detail.gamepad.axes[2]),
    RUD: sTransfer(e.detail.gamepad.axes[3]),
    LT:  sTransfer(e.detail.gamepad.buttons[6].value),
    RT:  sTransfer(e.detail.gamepad.buttons[7].value),
  };
  const rawButtons = {
    A: e.detail.gamepad.buttons[0].value,
    B: e.detail.gamepad.buttons[1].value,
    X: e.detail.gamepad.buttons[2].value,
    Y: e.detail.gamepad.buttons[3].value,
    LS: e.detail.gamepad.buttons[10].value,
    RS: e.detail.gamepad.buttons[11].value,
    UP: e.detail.gamepad.buttons[12].value,
    DOWN: e.detail.gamepad.buttons[13].value,
    LEFT: e.detail.gamepad.buttons[14].value,
    RIGHT: e.detail.gamepad.buttons[15].value,
    LB: e.detail.gamepad.buttons[4].value,
    RB: e.detail.gamepad.buttons[5].value,
    SELECT: e.detail.gamepad.buttons[8].value,
    MENU: e.detail.gamepad.buttons[9].value,
  };
  var newVals = {
    'Roll': 0.0,
    'Pitch': 0.0,
    'Lateral': 0.0,
    'Longitudinal': 0.0,
    'Vertical': 0.0,
    'Yaw': 0.0,
    'Go up': 0.0,
    'Go down': 0.0,
    'Go left': 0.0,
    'Go right': 0.0,
    'Rotate left': 0.0,
    'Rotate right': 0.0,
  };
  var tmp = null;
  Object.keys(config.axes.designators).map((key) => {
    tmp = config.axes.designators[key];
    if (tmp.current in newVals) {
      newVals[tmp.current] += (rawAxes[key] * (1-2*tmp.reverse) * tmp.engage);
    };
  });
  Object.keys(config.buttons.designators).map((key) => {
    tmp = config.buttons.designators[key];
    if (tmp.current in newVals) {
      newVals[tmp.current] += (rawButtons[key] * tmp.engage);
    };
  });
  return {
    ROLL: newVals['Roll'],
    PITCH: newVals['Pitch'],
    LAT: newVals['Lateral'] + newVals['Go right'] - newVals['Go left'],
    LONG: newVals['Longitudinal'],
    VERT: newVals['Vertical'] + newVals['Go up'] - newVals['Go down'],
    YAW: newVals['Yaw'] + newVals['Rotate right'] - newVals['Rotate left'],
  };
}

export default TranslateXboxAxis
