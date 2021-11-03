export const isPositive = (str) => {
  return Math.sign(Number.parseFloat(str)) >= 0;
};

export const showValueWithSign = (str) => {
  return Math.sign(Number.parseFloat(str)) >= 0 ? `+${showValueWithComma(str)}` : showValueWithComma(str);
};

export const showValueWithComma = (str, short = false) => {
  if (short) {
    return Number.parseFloat(Number.parseFloat(str / 1000).toFixed(1)).toLocaleString() + "K";
  }
  return Number.parseFloat(Number.parseFloat(str).toFixed(2)).toLocaleString();
};

export const dateStrToTimestamp = (str) => {
  // '2021-10-06T13:30:15.312Z' -> 1633527015
  return Math.round(new Date(str).getTime() / 1000);
};

export const timestampToDate = (ts) => {
  // 1633527015 -> '07/10/2021'
  return new Date(ts * 1000).toLocaleDateString();
};

export const getChangePercentage = (total, change) => {
  return (
    (Number.parseFloat(Number.parseFloat(change).toFixed(2)) / Number.parseFloat(total - change)) *
    100
  ).toFixed(2);
};
