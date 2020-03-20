import express from 'express';
import bannerRouter from './banner';
import landingUrlRouter from './landing-url';

const router = express.Router();

router.use('/banner', bannerRouter);
router.use('/landing-url', landingUrlRouter);

export default router;
