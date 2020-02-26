import passport from 'passport';


// ./customTypes/express.d.ts
declare global {
  namespace Express {
    interface Request {
      isAuthenticated: () => boolean;
      isUnauthenticated: () => boolean;
      [key: string]: any;
    }
  }
}
export {};
