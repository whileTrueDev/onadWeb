const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('./passportStrategy');
const config = require('./config.json');
const MySQLStore = require('express-mysql-session')(session);
// Router 정의
const mailerRouter = require('./routes/mailer');
const apiRouter = require('./routes/api');

const app = express();

process.env.NODE_ENV = (process.env.NODE_ENV && (process.env.NODE_ENV).trim().toLowerCase() == 'production') ? 'production' : 'development';
const BACK_HOST = 'http://localhost:3000';
let FRONT_HOST = 'http://localhost:3001';
if (process.env.NODE_ENV === 'production') {
  FRONT_HOST = config.production.reactHostName;
}

const storeOptions = {
  host: config.SESSIONSTORE.host,
  port: config.SESSIONSTORE.port,
  user: config.SESSIONSTORE.user,
  password: config.SESSIONSTORE.password,
  database: config.SESSIONSTORE.database,
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

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log(process.env.NODE_ENV);
// 선언만 하고 start는 bin에서 시작
module.exports = app;
