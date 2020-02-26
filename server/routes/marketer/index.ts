import express from 'express';
import profileRouter from './profile';
import inventoryRouter from './inventory';
import campaignRouter from './campaign';

const router = express.Router();

router.use('/', profileRouter);
router.use('/', inventoryRouter);
router.use('/campaign', campaignRouter);



export default router;
