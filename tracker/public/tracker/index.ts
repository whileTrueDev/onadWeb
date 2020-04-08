import express from 'express';
import adchatRouter from './adchat';

const router = express.Router();

router.use('/adchat', adchatRouter);
// 광고 상품

export default router;
