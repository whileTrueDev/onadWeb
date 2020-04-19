import geoip from 'geoip-lite';

export type ipToGeoData = {
  latitude: number;
  longitude: number;
  range: number[];
  country: string;
  region: string;
  city: string;
  ll: number[];
} | null

function ipToGeo(ip: string): ipToGeoData {
  const result = geoip.lookup(ip);
  if (result) {
    const [latitude, longitude] = result.ll;

    return { ...result, latitude, longitude };
  }
  return null;
}

export default ipToGeo;
