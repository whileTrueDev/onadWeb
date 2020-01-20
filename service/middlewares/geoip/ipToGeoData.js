const geoip = require('geoip-lite');

function ipToGeoData(ip) {
  const result = geoip.lookup(ip);
  if (result) {
    const [latitude, longitude] = result.ll;

    return { ...result, latitude, longitude };
  }
  return null;
}

module.exports = ipToGeoData;
