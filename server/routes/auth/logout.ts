import express from 'express';

const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
  req.logout();
  if (req.session) {
    req.session.destroy(() => {
      console.log('로그아웃 되었습니다.');
    });
  }
  res.end();
});

export default router;
