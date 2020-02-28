import express from 'express';
import impressionRouter from './impression'
import clickRouter from './click'

const router = express.Router();

router.use('/impression', impressionRouter)
router.use('/click', clickRouter)

export default router;
