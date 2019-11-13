// Date Fuction called when the message comes in
function now() {
  const thisTime = new Date();
  return thisTime.toLocaleString();
}

module.exports = now;
