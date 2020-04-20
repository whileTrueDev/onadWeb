import uaparser from 'ua-parser-js';
import UserAgent from '../@types/UserAgent';

export default function parseUserAgent(uastring: string| undefined): UserAgent {
  const UA = new uaparser.UAParser(uastring);
  const uaDevice = UA.getDevice();
  const OS = UA.getOS();
  const browser = UA.getBrowser();
  const browserEngine = UA.getEngine();

  // Define return values
  const device = `${uaDevice.vendor},${uaDevice.model},${uaDevice.type}`; // null 처리 필요
  const osName = OS.name;
  const osVersion = OS.version;
  const browserName = browser.name;
  const browserVersion = browser.version;
  const browserEngineName = browserEngine.name;
  const browserEngineVersion = browserEngine.version;

  return {
    device,
    osName,
    osVersion,
    browserName,
    browserVersion,
    browserEngineName,
    browserEngineVersion
  };
}
