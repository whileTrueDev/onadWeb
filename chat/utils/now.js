// Date Fuction called when the message comes in
function now() {
  const thisTime = new Date();
  const year = thisTime.getFullYear();
  const month = thisTime.getMonth();
  const date = thisTime.getDate();
  const hours = thisTime.getHours();
  const minutes = thisTime.getMinutes();
  const seconds = thisTime.getSeconds();

  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}

module.exports = now;
