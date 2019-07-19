const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./passportStrategy');
const bodyParser = require('body-parser');
const config = require('./config.json');

//Router 정의
var mailerRouter = require('./routes/mailer');
var apiRouter = require('./routes/api');
var app = express();


process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'production' ) ? 'production' : 'development';
let BACK_HOST = 'http://localhost:3000';
let FRONT_HOST = 'http://localhost:3001';
if (process.env.NODE_ENV === 'production') {
  FRONT_HOST = config.production.reactHostName;
}
// view를 찾을 경로를 `views`로 저장하여 rendering시 찾을 수 있도록 함.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 정적 리소스 처리
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(cookieParser());
app.use(session({
  secret: '@#@$MYSIGN#@$#$',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
 }));

//passport 초기화를 통해 'local' 전략이 수립된다.
app.use(passport.initialize());
app.use(passport.session());

//인증 method를 req에 추가한다.
app.use(require('./middlewares/checkAuthOnReq'));

// use CORS
const corsOptions = { origin: [FRONT_HOST], credentials: true };
app.use(cors(corsOptions));


app.use('/mailer', mailerRouter); 
app.use('/api', apiRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//선언만 하고 start는 bin에서 시작
module.exports = app;
