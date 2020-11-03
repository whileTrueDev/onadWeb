import OAuth2Strategy, { StrategyOptions, VerifyFunction } from 'passport-oauth2';

const AFREECA_AUTHORIZATION_URL = 'https://openapi.afreecatv.com/auth/code';
const AFREECA_TOKEN_URL = 'https://openapi.afreecatv.com/auth/token';

export interface AfreecaStrategyOptions extends Omit<StrategyOptions, 'authorizationURL'|'tokenURL'> {
  authorizationURL?: string;
  tokenURL?: string;
}

function buildOptions(options: AfreecaStrategyOptions): StrategyOptions {
  const _options = options;
  _options.authorizationURL = options.authorizationURL || AFREECA_AUTHORIZATION_URL;
  _options.tokenURL = options.tokenURL || AFREECA_TOKEN_URL;
  return _options as StrategyOptions;
}

export default class Strategy extends OAuth2Strategy {
  constructor(options: AfreecaStrategyOptions, verify: VerifyFunction) {
    super(buildOptions(options), verify);

    this.name = 'afreecatv';
    this._oauth2.setAuthMethod('Bearer');
    this._oauth2.useAuthorizationHeaderforGET(true);
  }
}
