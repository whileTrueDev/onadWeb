
function addComma(num) {
  return new Intl.NumberFormat().format(num);
}

export default function setNumberFormat(rawNum) {
  if (typeof rawNum === 'number') {
    const { length } = rawNum.toString();
    if (length > 4 && length < 8) {
      const number = (rawNum / 10000).toFixed(1);
      return `${addComma(number)}만`;
    }
    if (length === 8) {
      const number = (rawNum / 10000000).toFixed(1);
      return `${addComma(number)}천만`;
    }
    if (length > 8 && length < 12) {
      const number = (rawNum / 100000000).toFixed(1);
      return `${addComma(number)}억`;
    }
    if (length === 12) {
      const number = (rawNum / 100000000000).toFixed(1);
      return `${addComma(number)}천억`;
    }
    if (length > 12 && length <= 16) {
      const number = (rawNum / 1000000000000).toFixed(1);
      return `${addComma(number)}조`;
    }
    if (length > 16) {
      const number = (rawNum / 10000000000000000).toFixed(1);
      return `${addComma(number)}경`;
    }
    return addComma(rawNum);
  }
  return rawNum;
}
