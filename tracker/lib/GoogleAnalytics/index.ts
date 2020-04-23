import ua from 'universal-analytics';
import Express from 'express';

const USER_ID = 'UA-164238960-1';

export default function googleAnalytics(
  req: Express.Request, res: Express.Response, next: Express.NextFunction
): void {
  const visitor = ua(USER_ID);

  visitor.pageview({
    dp: req.url,
    dh: req.headers.host,
    uip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    ua: req.headers['user-agent'],
    dr: req.headers.referrer || req.headers.referer,
    de: req.headers['accept-encoding'],
    ul: req.headers['accept-language']
  }).send();

  next();
}
