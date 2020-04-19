export default interface UserAgent {
  device: string;
  osName: string | undefined;
  osVersion: string | undefined;
  browserName: string | undefined;
  browserVersion: string | undefined;
  browserEngineName: string | undefined;
  browserEngineVersion: string | undefined;
};
