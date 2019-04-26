const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./passportStrategy');
const pool = require('./connectionPool'); // local path로 key값을 사용하기 때문에 동일한 경로의 파일일 경우, 같은 객체를 공유하게 된다.
const checkLogin = require('./middlewares/ensureAuthenticated');

//Router 정의
var homeRouter = require('./routes/home');
var loginRouter = require('./routes/login');
var userRouter = require('./routes/users');
var registRouter = require('./routes/regist');

var app = express();

// view를 찾을 경로를 `views`로 저장하여 rendering시 찾을 수 있도록 함.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 정적 리소스 처리
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());
app.use(session({
  secret: '@#@$MYSIGN#@$#$',
  resave: false,
  saveUninitialized: true
 }));

//passport 초기화를 통해 'local' 전략이 수립된다.
app.use(passport.initialize());
app.use(passport.session());

//인증 method를 req에 추가한다.
app.use(require('./middlewares/checkAuthOnReq'));


app.use('/', homeRouter);
app.use('/login', loginRouter);
app.use('/user', checkLogin, userRouter);
app.use('/regist', registRouter); 


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

//선언만 하고 start는 bin에서 시작.
module.exports = app;
