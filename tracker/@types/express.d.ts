import { Session } from './session';

// ./customTypes/express.d.ts
declare global {
  namespace Express {
    interface Request {
      user?: Session;
      isAuthenticated: () => boolean;
      isUnauthenticated: () => boolean;
      [key: string]: any;
    }
  }
}
