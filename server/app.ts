import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import createError from 'http-errors';
import session from 'express-session'; // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
import dotenv from 'dotenv';
// middlewares
import checkAuthOnReq from './middlewares/checkAuthOnReq';
import passport from './passportStrategy';
import taxBillScheduler from './middlewares/scheduler/taxBillScheduler';
// // Router 정의
import mailerRouter from './routes/mailer';
import apiRouter from './routes/api';

dotenv.config();

const MySQLStore = require('express-mysql-session')(session);


const app = express();

process.env.ROOT_PATH = __dirname;
process.env.NODE_ENV = (process.env.NODE_ENV
  && (process.env.NODE_ENV).trim().toLowerCase() === 'production')
  ? 'production' : 'development';
let FRONT_HOST = process.env.DEV_REACT_HOSTNAME;
if (process.env.NODE_ENV === 'production') {
  FRONT_HOST = process.env.PRODUCTION_REACT_HOSTNAME;
}

// session처리
const storeOptions = {
  host: process.env.SESSION_STORE_DB_HOST,
  port: process.env.SESSION_STORE_DB_PORT,
  user: process.env.SESSION_STORE_DB_USER,
  password: process.env.SESSION_STORE_DB_PASSWORD,
  database: process.env.SESSION_STORE_DB_DATABASE,
};
const sessionStore = new MySQLStore(storeOptions);
app.use(session({
  secret: '@#@$MYSIGN#@$#$',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: false
  }
}));
// 정적리소스 처리
app.use(express.static(path.join(__dirname, 'public')));
// body parser 설정
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// cookie parser 설정
app.use(cookieParser());
// 인증 method를 req에 추가한다.
app.use(checkAuthOnReq);

// use CORS
const corsOptions = { origin: FRONT_HOST, credentials: true };
app.use(cors(corsOptions));

// passport 초기화를 통해 'local' 전략이 수립된다.
app.use(passport.initialize());
app.use(passport.session());

// For aws ELB health check
app.get('/', (req, res, next) => {
  res.sendStatus(200);
});
// Router 추가
app.use('/mailer', mailerRouter);
app.use('/api', apiRouter);

// Error handling
interface Err extends Error {
  status: number;
  data?: any;
}
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler 무조건 app.use 중 맨 마지막에 위치해야 한다.
app.use((err: Err, req: express.Request, res: express.Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  if (err) {
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
});


console.log('ENVIRONMENT: ', process.env.NODE_ENV);
console.log(`SCHEDULER: [${taxBillScheduler.name}] - ON `);

// 선언만 하고 start는 bin에서 시작
module.exports = app;
