// Transfer functions
export function tangentTransfer(x,z) {
  const val = Math.pow(Math.abs(x),z)*Math.tan((Math.PI/4)*x);
  if (val < 0.075) {
    return 0;
  } else {
    return val;
  }
};
export function tangentTransfers(X,z) {
  return X.map((x) => {
    const val = Math.pow(Math.abs(x),z)*Math.tan((Math.PI/4)*x);
    if (val < 0.075) {
      return 0;
    } else {
      return val;
    }
  })
};
export function sTransfer(x,m) {
  const val = m*Math.sin((x*Math.PI)/2)*Math.abs(Math.sin((x*Math.PI)/2));
  if (val < 0.075) {
    return 0;
  } else {
    return val;
  }
};
export function sTransfers(X,m) {
  return X.map((x) => {
    const val = m*Math.sin((x*Math.PI)/2)*Math.abs(Math.sin((x*Math.PI)/2))
    if (val < 0.075) {
      return 0;
    } else {
      return val;
    }
  })
};
