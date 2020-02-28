import express from 'express';
import inquiryRoute from './inquiry'

const router = express.Router();

// router.route('/')

router.use('/inquiry', inquiryRoute)

export default router;
