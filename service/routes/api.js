const express = require('express');

const router = express.Router();

const loginRouter = require('./login');
const registRouter = require('./regist');
const dashboardRouter = require('./dashboard');
const payRouter = require('./payment/pay');

router.use('/login', loginRouter);
router.use('/regist', registRouter);
router.use('/dashboard', dashboardRouter);
router.use('/pay', payRouter);

module.exports = router;
