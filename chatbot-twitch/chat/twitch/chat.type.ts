import { Badges } from 'tmi.js';

export interface Chat {
  creatorId: string | undefined;
  time: Date;
  name: string | undefined;
  userid: string | undefined;
  subscriber: boolean | undefined;
  manager: boolean | undefined;
  badges: Badges | undefined;
  text: string;
}
