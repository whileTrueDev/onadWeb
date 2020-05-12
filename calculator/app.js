require('dotenv').config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
require('./javascripts/calculation_v.3')()
  .then(
    require('./javascripts/trackingCalculator_v.2')
  )
  .then(() => {
    process.exit(0);
  });
