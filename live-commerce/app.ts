import socketio, { Socket } from 'socket.io';
import express from 'express';
import http from 'http';
import { UserInfo, SocketInfo, TextData, PurchaseMessage, ImageData } from './@types/data'
const app = express();
const httpServer = http.createServer(app);
const io = socketio(httpServer);

const PORT = 3060;
process.env.NODE_ENV = (process.env.NODE_ENV && (process.env.NODE_ENV).trim().toLowerCase() === 'production') ? 'production' : 'development';

const socketInfo:SocketInfo = {}

app.use('/lib', express.static(`${__dirname}/lib`)); // 디렉토리 정적으로 고정하는 부분
app.use('/public', express.static(`${__dirname}/public`)); // 디렉토리 정적으로 고정하는 부분
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`)

app.get('/', (req, res, next) => {
  res.sendStatus(200)
})

app.get('/:id', (req, res, next) => {
  res.render('client.ejs');
});

io.on('connection', (socket:Socket) => {
  socket.on('new client', (clientInfo) => { // 새로운 접속
    const url = clientInfo.THIS_URL
    const device = clientInfo.device
    if (socketInfo[url]) {
      const infoList:UserInfo[] = socketInfo[url]
      infoList.push({ socketId:socket.id, device })
    } else {
      const infoList:UserInfo[] = []
      infoList.push({ socketId:socket.id, device })
      socketInfo[url] = infoList
    }
  })
  
  socket.on('disconnect', () => { // 접속종료시
    const SOCKET_ID: string = socket.id;
    if (Object.values(socketInfo)) {
      const itemToFind = Object.values(socketInfo)[0]?.find(function(item) {return item.socketId === SOCKET_ID})
      const idx = Object.values(socketInfo)[0]?.indexOf(itemToFind) 
      if (idx > -1) Object.values(socketInfo)[0]?.splice(idx, 1)
    }
  });

  socket.on('request creator list', (data) => { // 소켓 접속 크리에이터 리스트를 관리자로 전송
    // data.url에는 /가 포함되어 있다
    const advertiseUrl = data && data.url ? data.url.split('/')[1] : null
    const fullUrl:(string|undefined)[] = Object.keys(socketInfo).map((url:string) => {
      if (advertiseUrl && url && url.split('/').indexOf(advertiseUrl) !== -1) {
        return url
      }
    }).filter((url: string | undefined) => {
      return url !== undefined;
    });
    if (process.env.NODE_ENV === 'development') {
      io.to(data.clientId).emit('creator list from server', fullUrl[0] ? socketInfo[fullUrl[0]] : null)
    }
    else if (process.env.NODE_ENV === 'production') { 
      io.to(data.clientId).emit('creator list from server', fullUrl[0] ? socketInfo[fullUrl[0]] : null)
    }
  })


  socket.on('live commerce image', (data:ImageData) => {
    const clientId = data.clientId
    io.to(clientId).emit('get live commerce image', data)
  })

  socket.on('purshase alarm', (data:TextData) => {
    const clientId = data.clientId
    const text = data.text
    io.to(clientId).emit('get chat', text)
  })

  socket.on('bottom purchase message', (data:PurchaseMessage) => {
    const clientId = data.clientId
    const userId = data.userId;
    const text = data.text
    const completeText = `${text} [${userId}]`
    io.to(clientId).emit('get bottom purchase message', completeText)
    io.to(clientId).emit('get top-left ranking', data)
  })
  
  socket.on('right-top-purchase-message', (data:PurchaseMessage) => {
    const clientId = data.clientId
    const userId = data.userId;
    const text = data.text;
    const completeText = `${text} - [${userId}]`
    io.to(clientId).emit('get right-top purchase message', data)
    io.to(clientId).emit('get top-left ranking', data)
    io.to(clientId).emit('get bottom purchase message', completeText)
  })

  socket.on('clear bottom area from admin', (data:TextData) => {
    const clientId = data.clientId
    io.to(clientId).emit('clear bottom area to client')
    io.to(clientId).emit('clear ranking area')
  })

  socket.on('show bottom area from admin', (data:TextData) => {
    const clientId = data.clientId
    io.to(clientId).emit('show bottom area to client')
  })
  
  socket.on('bottom area message', (data:TextData) => {
    const clientId = data.clientId
    const text = data.text
    io.to(clientId).emit('get bottom area message', text)
  })

  socket.on('show live commerce', (clientId:string) => {
    io.to(clientId).emit('show screen')
  })

  socket.on('quit live commerce', (clientId:string) => {
    io.to(clientId).emit('clear screen')
  })
})


httpServer.listen(PORT, () => {
  console.log(`--LIVE COMMERCE SERVER-- \nMODE : [${process.env.NODE_ENV}] \nPORT : ${PORT}\n`);
});