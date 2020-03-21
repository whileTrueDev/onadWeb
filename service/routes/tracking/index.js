const express = require('express');
const adchatRouter = require('./adchat');

const router = express.Router();

router.use('/adchat', adchatRouter);
// 광고 상품

module.exports = router;
