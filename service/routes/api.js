const express = require('express');

const router = express.Router();

const loginRouter = require('./login/login');
const registRouter = require('./regist/regist');
const dashboardRouter = require('./dashboard/dashboard');
const payRouter = require('./payment/pay');

router.use('/login', loginRouter);
router.use('/regist', registRouter);
router.use('/dashboard', dashboardRouter);
router.use('/pay', payRouter);

module.exports = router;
