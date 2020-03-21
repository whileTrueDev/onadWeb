require('dotenv').config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
const express = require('express');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const schedule = require('node-schedule');
const sql = require('./public/models/select');
const pool = require('./public/models/connect');
const requestImg = require('./public/requestImg.js');
// port 설정 및 hostname 설정
const PORT = 3003;
process.env.NODE_ENV = (process.env.NODE_ENV && (process.env.NODE_ENV).trim().toLowerCase() === 'production') ? 'production' : 'development';
let SOCKET_HOST = process.env.DEV_SOCKET_HOSTNAME;
if (process.env.NODE_ENV === 'production') {
  SOCKET_HOST = process.env.PRODUCTION_SOCKET_HOSTNAME;
}
// view engine
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// static
app.use('/public', express.static(`${__dirname}/public`)); // 디렉토리 정적으로 고정하는 부분
app.use(express.static(`${__dirname}/public`)); // 디렉토리 정적으로 고정하는 부분

app.get('/wrongurl', (req, res) => {
  res.render('wrongUrl.ejs');
});

app.get('/duplicate', (req, res) => {
  res.render('duplicate.ejs');
});

app.get('/browserwarn', (req, res) => {
  res.render('browserWarn.ejs');
});

app.get('/error', (req, res) => {
  res.render('error.ejs');
});

app.get('/text/:id', (req, res) => {
  res.render('text.ejs');
});

app.get('/banner/:id', (req, res, next) => { // /banner/:id로 라우팅
  res.render('client.ejs');
});

app.get('/check', (req, res, next) => { // /banner/:id로 라우팅
  res.render('browsercheck.ejs');
});

app.get('/test', (req, res, next) => { // /banner/:id로 라우팅
  res.render('test.ejs');
});

(function () {
  const socketsInfo = {}; // 클라이언트로 보낼 socketinfo 객체
  io.on('connection', (socket) => {
    console.log('socket client on'); // 연결이 되면 로그 발생
    let clientId = socket.id; // socketID 획득
    const req = socket.request; // req
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // 클라이언트 ip주소 얻는 부분
    const roomInfo = socket.adapter.rooms; // 현재 웹소켓에 접속중이 room들과 그 접속자들의 정보 얻음
    const rule = new schedule.RecurrenceRule(); // 스케쥴러 객체 생성
    rule.hour = new schedule.Range(0, 23); // cronTask 시간지정
    rule.minute = [0, 10, 20, 30, 40, 50]; // cronTask 실행되는 분(minute)
    
    const cronTask = schedule.scheduleJob(rule, () => { // 스케쥴러를 통해 1분마다 db에 배너정보 전송
      socket.emit('response banner data to server', {}); // client로 emit
      socket.emit('re-render at client', {});
    });

    socket.on('new client', (msg) => { // 새로운 클라이언트 접속 시 발생
      const _url = msg[0];
      const history = msg[1];
      const urlArray = Object.values(socketsInfo);
      if (process.env.NODE_ENV === 'development') {
        socket.join('banner room');
        socket.emit('host pass', SOCKET_HOST);
        socketsInfo[Object.keys(roomInfo).pop()] = _url; // roomInfo에서 소켓아이디 불러와서 socketsInfo 객체에 {'id' : url} 형태로 저장
        requestImg(sql, socket, [_url, false]);
      } else if (history !== 1) {
        const destination = `${SOCKET_HOST}/browserWarn`;
        socket.emit('browser warning', destination);
      } else {
        socket.join('banner room');
        socket.emit('host pass', SOCKET_HOST);
        socketsInfo[Object.keys(roomInfo).pop()] = _url; // roomInfo에서 소켓아이디 불러와서 socketsInfo 객체에 {'id' : url} 형태로 저장
        requestImg(sql, socket, [_url, false]);
      }
    });

    socket.on('new marquee', () => {
      socket.join('marquee room');
      console.log('text socketinfo : ', socketsInfo);
    });

    socket.on('disconnect', () => { // 접속종료시
      delete socketsInfo[clientId]; // socketsInfo에서 접속종료한 clientID 삭제
      clientId = undefined;
      clearInterval(socket.interval);
    });

    socket.on('write to db', (msg) => {
      pool.getConnection((err, conn) => {
        if (err) return err;
        const campaignId = msg[0][0];
        const creatorId = msg[0][1];
        const program = msg[1];
        const writeQuery = 'INSERT INTO campaignTimestamp (campaignId, creatorId, program) VALUES (?, ?, ?);';
        conn.query(writeQuery, [campaignId, creatorId, program], (err, result, fields) => {
          conn.release();
          if (err) return err;
        });
      });
    });

    socket.on('re-render', (msg) => {
      requestImg(sql, socket, msg);
    });

    socket.on('pageActive', (_url) => {
      const activeState = true;
      requestImg(sql, socket, [_url, false], activeState);
    });

    socket.on('pageActive handler', (msg) => {
      const bannerName = msg[0];
      const state = msg[1];
      const program = msg[2];
      pool.getConnection((err, conn) => {
        if (err) return err;
        const activeQuery = 'INSERT INTO bannerVisible (advertiseUrl, visibleState, program) VALUES (?, ?, ?);';
        conn.query(activeQuery, [bannerName, state, program], (err, result, fields) => {
          conn.release();
          if (err) return err;
        });
      });
    });
  });
}());

http.listen(PORT, () => {
  console.log(`node_websocket server on ${process.env.NODE_ENV} mode`);
});
