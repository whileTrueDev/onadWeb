// 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import http from 'http';
import socketio, { Socket } from 'socket.io';
import nodeSchedule from 'node-schedule';
import doQuery from './models/doQuery';
import callImg from './public/callImg';

const app = express();
const httpServer = http.createServer(app);
const io = socketio(httpServer);

process.env.NODE_ENV = (process.env.NODE_ENV && (process.env.NODE_ENV).trim().toLowerCase() === 'production') ? 'production' : 'development';

app.use('/public', express.static(`${__dirname}/public`)); // 디렉토리 정적으로 고정하는 부분
// view engine
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/', (req: express.Request, res: express.Response) => {
  res.sendStatus(200);
});

app.get('/wrongurl', (req, res) => {
  res.render('wrongUrl.ejs');
});

app.get('/browserwarn', (req, res) => {
  res.render('browserWarn.ejs');
});

app.get('/duplicate', (req, res) => {
  res.render('duplicate.ejs');
});

app.get('/banner/:id', (req, res, next) => { // /banner/:id로 라우팅
  res.render('client.ejs');
});

// nodemon --expose-gc file_dir
// 20초에 한 번마다 garbage collector
setInterval(function(){
  global.gc();
}, 20000);

interface SocketInfo {
  [key: string]: string;
}
(
  function () {
    const SOCKET_HOST = process.env.SOCKET_HOSTNAME;
    const socketInfo: SocketInfo = {};
    io.on('connection', (socket: Socket) => {
      let SOCKET_ID: string = socket.id;
      const urlArray: Array<string> = Object.values(socketInfo);

      // ***********************************************************
      // 스케쥴링
      const rule = new nodeSchedule.RecurrenceRule(); // 스케쥴러 객체 생성
      rule.hour = new nodeSchedule.Range(0, 23); // cronTask 시간지정
      rule.minute = [0, 10, 20, 30, 40, 50]; // cronTask 실행되는 분(minute)
      // cronTask
      nodeSchedule.scheduleJob(rule, () => { // 스케쥴러를 통해 10분마다 db에 배너정보 전송
        socket.emit('re-render at client', {});
      });

      // ***********************************************************
      // 첫 입장시 발생되는 이벤트인 "new client" 이벤트 핸들러
      socket.on('new client', (msg: [string, number, string]) => {
        const CLIENT_URL = msg[0];
        const HISTORY = msg[1];
        const programType = msg[2];
        if (process.env.NODE_ENV === 'development') {
          console.log('SOCKET ON');
          socket.emit('host pass', SOCKET_HOST);
          callImg(socket, [CLIENT_URL, '', programType]);
        } else if (
          // 트위치 스튜디오 또는 아프리카 프릭샷으로 접속하지 않았으면서
          !['afreeca-freecshot', 'twitch-studio'].includes(programType)
          // history.length가 1이 아닌 경우에 잘못된 접속 처리
          && HISTORY !== 1) {
          const DESTINATION_URL = `${SOCKET_HOST}/browserWarn`;
          socket.emit('browser warning', DESTINATION_URL);
        }

        if (urlArray.includes(CLIENT_URL)) {
          const DESTINATION_URL = `${SOCKET_HOST}/duplicate`;
          socket.emit('duplicate', DESTINATION_URL);
        } else {
          socketInfo[SOCKET_ID] = CLIENT_URL;
          socket.emit('host pass', SOCKET_HOST);
          callImg(socket, [CLIENT_URL, '', programType]);
        }
      });

      // ***********************************************************
      // 접속 종료시 발생되는 이벤트인 "disconnect" 이벤트 핸들러
      socket.on('disconnect', () => { // 접속종료시
        delete socketInfo[SOCKET_ID]; // socketsInfo에서 접속종료한 clientID 삭제
        SOCKET_ID = '';
      });

      // ***********************************************************
      // 송출될 광고 재요청 이벤트 : "re-render" 이벤트 핸들러
      socket.on('re-render', (msg: [string, string, string]) => {
        callImg(socket, msg);
      });

      // ***********************************************************
      // 
      socket.on('pageOn', (msg: [string, string]) => {
        const CLIENT_URL = msg[0];
        const programType = msg[1];
        callImg(socket, [CLIENT_URL, '', programType]);
      });

      // 배너 더블 클릭을 통해 ON/OFF 조절 
      // bannerVisible 에 상태 삽입
      socket.on('pageActive handler', (msg: [string, boolean, string]) => {
        // 배너창을 띄웠을 때는 state = 1
        // 배너창 숨겼을 때는 state = 0
        const clientUrl = msg[0];
        const state = msg[1] === true ? 1 : 0;
        const program = msg[2];
        const activeQuery = 'INSERT INTO bannerVisible (advertiseUrl, visibleState, program, type) VALUES (?, ?, ?, 0);';
        doQuery(activeQuery, [clientUrl, state, program]);
      });

      // 배너 더블 클릭을 통해 ON/OFF 조절 
      // bannerVisible 에 상태 삽입
      socket.on('banner click', (msg: [string, boolean, string]) => {
        const clientUrl = msg[0];
        const state = msg[1] === true ? 1 : 0;
        const program = msg[2];
        const hiddenQuery = 'INSERT INTO bannerVisible (advertiseUrl, visibleState, program, type) VALUES (?, ?, ?, 1);';
        doQuery(hiddenQuery, [clientUrl, state, program]);
      });
      // ***********************************************************
    });
  }());

httpServer.listen(3002, () => {
  console.log(`node_websocket server on ${process.env.NODE_ENV} mode`);
});
