// 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
require('dotenv').config();

require('./javascripts/calculation_v.5')()
  // CPC계산
  .then(require('./javascripts/trackingCalculator_v.3'))
  // 추천인 코드 계산
  .then(require('./javascripts/referralCodeCalculator'))
  // CPS 계산
  .then(require('./javascripts/cpsCalculator'))
  .then(() => {
    process.exit(0);
  });
