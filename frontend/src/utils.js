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
