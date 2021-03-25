require('dotenv').config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
// require('./javascripts/calculation_v.4')()
// // CPC계산
//   .then(require('./javascripts/trackingCalculator_v.3'))
// // 추천인 코드 계산
//   .then(require('./javascripts/referralCodeCalculator'))
//   .then(() => {
//     process.exit(0);
//   });


require('./javascripts/cpsCalculator')()
  .then(() => console.log('done'))
  .then(() => process.exit(0))
  .catch((err) => console.error(err));
