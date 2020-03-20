import express from 'express';
import profileRouter from './profile';
import inventoryRouter from './inventory';
import campaignRouter from './campaign';
import cashRouter from './cash';
import adRouter from './ad';
import geoRouter from './geo';


const router = express.Router();

router.use('/inquiry', profileRouter);
router.use('/', profileRouter);
router.use('/', inventoryRouter);
router.use('/ad', adRouter);
router.use('/campaign', campaignRouter);
router.use('/cash', cashRouter);
router.use('/geo', geoRouter);


export default router;
