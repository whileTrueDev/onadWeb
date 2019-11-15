require('dotenv').config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('./passportStrategy');
// Router 정의
const mailerRouter = require('./routes/mailer');
const apiRouter = require('./routes/api');
// marketer Tax Bill scheduler
const taxBillScheduler = require('./middlewares/scheduler/taxBillScheduler');

const app = express();

process.env.ROOT_PATH = __dirname;
process.env.NODE_ENV = (process.env.NODE_ENV
  && (process.env.NODE_ENV).trim().toLowerCase() === 'production')
  ? 'production' : 'development';
let FRONT_HOST = process.env.DEV_REACT_HOSTNAME;
if (process.env.NODE_ENV === 'production') {
  FRONT_HOST = process.env.PRODUCTION_REACT_HOSTNAME;
}

const storeOptions = {
  host: process.env.SESSION_STORE_DB_HOST,
  port: process.env.SESSION_STORE_DB_PORT,
  user: process.env.SESSION_STORE_DB_USER,
  password: process.env.SESSION_STORE_DB_PASSWORD,
  database: process.env.SESSION_STORE_DB_DATABASE,
};
const sessionStore = new MySQLStore(storeOptions);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 정적 리소스 처리
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cookieParser());
app.use(session({
  secret: '@#@$MYSIGN#@$#$',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: false
  }
}));
// passport 초기화를 통해 'local' 전략이 수립된다.
app.use(passport.initialize());
app.use(passport.session());

// 인증 method를 req에 추가한다.
app.use(require('./middlewares/checkAuthOnReq'));

// use CORS
const corsOptions = { origin: FRONT_HOST, credentials: true };
app.use(cors(corsOptions));

// for aws ELB health check
app.get('/', (req, res, next) => {
  res.sendStatus(200);
});

app.use('/mailer', mailerRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler 무조건 app.use 중 맨 마지막에 위치해야 한다.
app.use((err, req, res, next) => {
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
console.log('===========================================');
// 선언만 하고 start는 bin에서 시작
module.exports = app;
