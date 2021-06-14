/* eslint-disable camelcase */
export interface TwitchProfile {
  id: string;
  login: string;
  display_name: string;
  type: string; // ''
  broadcaster_type: string; // ''
  description: string; // ''
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  email: string;
}
export interface TwitchProfileResponse {
  data: [TwitchProfile];
}

export interface TwitchTokenRes {
  access_token: string;
  refresh_token: string;
  scope: string;
}
