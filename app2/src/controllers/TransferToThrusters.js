// event -> translator -> transfer -> push
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
  return {
    flv: flvR/mV, // Front Left Vertical
    frv: frvR/mV, // Front Right Vertical
    alv: alvR/mV, // Aft Left Vertical
    arv: arvR/mV, // Aft Right Vertical
    flh: flhR/mH, // Front Left Horizontal
    frh: frhR/mH, // Front Right Horizontal
    alh: alhR/mH, // Aft Left Horizontal
    arh: arhR/mH, // Aft Right Horizontal
  };
}
