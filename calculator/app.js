require('dotenv').config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
const express = require('express');

const app = express();

console.log('계산프로그램을 IMPORT 합니다.');
require('./javascripts/calculation_v.3');
// require('./javascripts/landingCalculator_v.1');
require('./javascripts/updatelimit');
require('./javascripts/trackingCalculator');

module.exports = app;
