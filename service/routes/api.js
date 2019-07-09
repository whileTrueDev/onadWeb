const express = require('express');
const router = express.Router();

var loginRouter = require('./login');
var registRouter = require('./regist');
var dashboardRouter = require('./dashboard');
var validatedAccountRouter = require('./validatedAccount');
var adminRouter = require('./admin');

router.use('/login', loginRouter);
router.use('/regist', registRouter);
router.use('/dashboard', dashboardRouter);
router.use('/validatedAccount', validatedAccountRouter)
router.use('/admin', adminRouter)

module.exports = router;