require('dotenv').config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
const express = require('express');

const app = express();

// process.env.NODE_ENV = ( process.env.NODE_ENV &&
// ( process.env.NODE_ENV ).trim().toLowerCase() == 'production' ) ? 'production' : 'development';
// if(process.env.NODE_ENV === 'production'){
//   console.log('계산프로그램을 IMPORT 합니다.');
//   const calculation = require('./middlewares/calculation_v.0');
// }
// let BACK_HOST = 'http://localhost:3000';
// let FRONT_HOST = 'http://localhost:3001';
// if (process.env.NODE_ENV === 'production') {
//   FRONT_HOST = config.production.reactHostName;
// }

console.log('계산프로그램을 IMPORT 합니다.');
require('./javascripts/calculation_v.1');
require('./javascripts/landingCalculator');

module.exports = app;
