import express from 'express';
import bannerRouter from './banner';
import landingUrlRouter from './landing-url';
import merchandisesRouter from './merchandises';

const router = express.Router();

router.use('/banner', bannerRouter);
router.use('/landing-url', landingUrlRouter);
router.use('/merchandises', merchandisesRouter);

export default router;
