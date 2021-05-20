import { OnadSession } from '../src/interfaces/Session.interface';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends OnadSession { }
  }
}


declare module 'express-session' {
  interface SessionData {
    passport?: {
      user: OnadSession;
    };
  }
}
