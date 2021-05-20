/* eslint-disable class-methods-use-this */
import OAuth2Strategy from 'passport-oauth2';
import request from 'request';

const clientID = process.env.TWITCH_CLIENT_ID;

export interface TwitchStrategyOptions extends OAuth2Strategy.StrategyOptionsWithRequest{
  forceVerify?: boolean;
}
class TwitchStrategy extends OAuth2Strategy {
  constructor(
    name: string,
    options: TwitchStrategyOptions,
    verify: OAuth2Strategy.VerifyFunctionWithRequest
  ) {
    super(options, verify);

    this.name = name;

    this._oauth2.setAuthMethod('Bearer');
    this._oauth2.useAuthorizationHeaderforGET(true);
  }

  /**
   * Retrieve user profile from Twitch.
   *
   * This function constructs a normalized profile, with the following properties:
   *   - `provider`         always set to `twitch`
   *   - `id`
   *   - `username`
   *   - `displayName`
   * @param {String} accessToken
   * @param {Function} done
   * @api protected
   */
  userProfile(accessToken: string, done: (err?: Error | null, profile?: any) => void): void {
    const options = {
      url: 'https://api.twitch.tv/helix/users',
      method: 'GET',
      headers: {
        'Client-ID': clientID,
        Accept: 'application/vnd.twitchtv.v5+json',
        Authorization: `Bearer ${accessToken}`
      }
    };

    request(options, (error, response, body) => {
      if (response && response.statusCode === 200) {
        done(null, JSON.parse(body).data[0]);
      } else {
        done(JSON.parse(body));
      }
    });
  }

  authorizationParams(options: any): any {
    const params: {[key: string]: any} = {};
    if (options.forceVerify) {
      params.force_verify = !!options.forceVerify;
    }
    return params;
  }
}

export default { Strategy: TwitchStrategy };
