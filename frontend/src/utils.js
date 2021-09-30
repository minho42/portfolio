export const isPositive = (str) => {
  return Math.sign(Number.parseFloat(str)) >= 0;
};

export const showValueWithSign = (str) => {
  return Math.sign(Number.parseFloat(str)) >= 0
    ? `+${Number.parseFloat(str).toLocaleString()}`
    : Number.parseFloat(str).toLocaleString();
};
