// event -> translator -> transfer -> push

// Verticals =
// [[ 1,-1, 1]  [[Roll]
//  [-1,-1, 1]   [Pitch]
//  [ 1, 1, 1]   [Vertical]]
//  [-1, 1, 1]]

// Horizontals =
// [[ 1, 1, 1]  [[Longitudinal]
//  [ 1,-1,-1]   [Lateral]
//  [ 1,-1, 1]   [Yaw]]
//  [ 1, 1,-1]]

export default function TransferToThrusters(data) {
  const flvR = data.VERT + data.ROLL - data.PITCH;
  const frvR = data.VERT - data.ROLL - data.PITCH;
  const alvR = data.VERT + data.ROLL + data.PITCH;
  const arvR = data.VERT - data.ROLL + data.PITCH;
  const flhR = data.LONG + data.LAT + data.YAW;
  const frhR = data.LONG - data.LAT - data.YAW;
  const alhR = data.LONG - data.LAT + data.YAW;
  const arhR = data.LONG + data.LAT - data.YAW;
  const mV = Math.max(Math.abs(flvR), Math.abs(frvR), Math.abs(alvR), Math.abs(arvR), 1);
  const mH = Math.max(Math.abs(flhR), Math.abs(frhR), Math.abs(alhR), Math.abs(arhR), 1);
  const maximums = 0.8;
  return {
    flv: Math.max(-maximums, Math.min(flvR/mV, maximums)), // Front Left Vertical
    frv: Math.max(-maximums, Math.min(frvR/mV, maximums)), // Front Right Vertical
    alv: Math.max(-maximums, Math.min(alvR/mV, maximums)), // Aft Left Vertical
    arv: Math.max(-maximums, Math.min(arvR/mV, maximums)), // Aft Right Vertical
    flh: Math.max(-maximums, Math.min(flhR/mH, maximums)), // Front Left Horizontal
    frh: Math.max(-maximums, Math.min(frhR/mH, maximums)), // Front Right Horizontal
    alh: Math.max(-maximums, Math.min(alhR/mH, maximums)), // Aft Left Horizontal
    arh: Math.max(-maximums, Math.min(arhR/mH, maximums)), // Aft Right Horizontal
  };
}
