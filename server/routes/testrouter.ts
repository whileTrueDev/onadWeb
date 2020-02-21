import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('testrouter, next');
  res.send('testrouter');
});

export default router;
