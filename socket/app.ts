// 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import socketio from 'socket.io';

dotenv.config();

import doQuery from './models/doQuery'
import callImg from './public/callImg';


// import nodeschedule from 'node-schedule';

const app = express();
const httpServer = http.createServer(app);
const io = socketio(httpServer);

const PORT = 3002;
process.env.NODE_ENV = (process.env.NODE_ENV && (process.env.NODE_ENV).trim().toLowerCase() === 'production') ? 'production' : 'development';
let SOCKET_HOST = process.env.DEV_SOCKET_HOSTNAME;
if (process.env.NODE_ENV === 'production') {
  SOCKET_HOST = process.env.PRODUCTION_SOCKET_HOSTNAME;
}

app.use('/public', express.static(`${__dirname}/public`)); // 디렉토리 정적으로 고정하는 부분
// view engine
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/', (req: express.Request, res: express.Response) => {
  res.send(200);
});

app.get('/wrongurl', (req, res) => {
  res.render('wrongUrl.ejs');
});

app.get('/browserwarn', (req, res) => {
  res.render('browserWarn.ejs');
});

app.get('/banner/:id', (req, res, next) => { // /banner/:id로 라우팅
  res.render('client.ejs');
});

io.on('connection', (socket: any) => {
  console.log('SOCKET ON');

  socket.on('new client', (msg: [string, number]) => {
    const CLIENT_URL = msg[0];
    const HISTORY = msg[1];
    if (process.env.NODE_ENV === 'development') {
      socket.join('banner room');
      socket.emit('host pass', SOCKET_HOST);
      console.log(CLIENT_URL);
      callImg(socket, [CLIENT_URL, '']);
    } else if (HISTORY !== 1) {
      const destination = `${SOCKET_HOST}/browserWarn`;
      socket.emit('browser warning', destination);
    } else {
      socket.join('banner room');
      socket.emit('host pass', SOCKET_HOST);
      callImg(socket, [CLIENT_URL, '']);
    }
  });

  socket.on('write to db', (msg: [string[], string]) => {
    const campaignId = msg[0][0];
    const creatorId = msg[0][1];
    const program = msg[1];
    const writeQuery = 'INSERT INTO campaignTimestamp (campaignId, creatorId, program) VALUES (?, ?, ?);';
    doQuery(writeQuery, [campaignId, creatorId, program])
  });

  socket.on('re-render', (msg: [string, string]) => {
    callImg(socket, msg);
  });

  socket.on('hiddenTest', (msg: string) => { console.log(msg); });
  socket.on('showTest', (msg: string) => { console.log(msg); });

});

httpServer.listen(PORT, () => {
  console.log(`node_websocket server on ${process.env.NODE_ENV} mode`);
});
