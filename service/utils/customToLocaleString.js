function customToLocaleString(utcDateObject) {
  if (process.platform === 'darwin') {
    return utcDateObject.toLocaleString();
  }
  const year = utcDateObject.getFullYear();
  const month = utcDateObject.getMonth() + 1;
  const date = utcDateObject.getDate();
  const hours = utcDateObject.getHours();
  const minutes = utcDateObject.getMinutes();
  const seconds = utcDateObject.getSeconds();

  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}

module.exports = customToLocaleString;
