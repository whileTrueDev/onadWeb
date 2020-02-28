import express from 'express';
import creatorsRouter from './creators';

const router = express.Router();

router.use('/', creatorsRouter);

export default router;
