const express = require('express');
const pool = require('../../model/connectionPool');
const kakaoPayRouter = require('./kakao/kakao');

const router = express.Router();

router.use('/kakao', kakaoPayRouter);
// ... other routes

module.exports = router;