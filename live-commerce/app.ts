import socketio, { Socket } from 'socket.io';
import express from 'express';
import http from 'http';
import {
  UserInfo, SocketInfo, TextData, PurchaseMessage, ImageData
} from './@types/data';
import doQuery from './models/doQuery';
import googleTextToSpeech from './lib/googleTextToSpeech'

const app = express();
const httpServer = http.createServer(app);
const io = socketio(httpServer);

const PORT = 3060;
process.env.NODE_ENV = (process.env.NODE_ENV && (process.env.NODE_ENV).trim().toLowerCase() === 'production') ? 'production' : 'development';

const socketInfo: SocketInfo = {};

app.use('/lib', express.static(`${__dirname}/lib`)); // 디렉토리 정적으로 고정하는 부분
app.use('/public', express.static(`${__dirname}/public`)); // 디렉토리 정적으로 고정하는 부분
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.get('/:id', (req, res) => {
  res.render('client.ejs');
});

io.on('connection', (socket: Socket) => {
  socket.on('new client', (clientInfo) => { // 새로운 접속
    const url = clientInfo.THIS_URL;
    const roomName = url?.split('/').pop()
    if (roomName){
      socket.join(roomName)
    }
    const { device } = clientInfo;
    if (socketInfo[url]) {
      const infoList: UserInfo[] = socketInfo[url];
      infoList.push({ socketId: socket.id, device });
    } else {
      const infoList: UserInfo[] = [];
      infoList.push({ socketId: socket.id, device });
      socketInfo[url] = infoList;
    }
  });

  socket.on('disconnect', () => { // 접속종료시
    const SOCKET_ID: string = socket.id;
    if (Object.values(socketInfo)) {
      const itemToFind = Object.values(socketInfo)[0]?.find((item) => item.socketId === SOCKET_ID);
      const idx = Object.values(socketInfo)[0]?.indexOf(itemToFind);
      if (idx > -1) {
        return Object.values(socketInfo)[0]?.splice(idx, 1);
      }
    }
    return null;
  });

  socket.on('request creator list', (data) => { // 소켓 접속 크리에이터 리스트를 관리자로 전송
    // data.url에는 /가 포함되어 있다
    const advertiseUrl = data && data.url ? data.url.split('/')[1] : null;
    const fullUrl: (string|undefined)[] = Object.keys(socketInfo).map((url: string) => {
      if (advertiseUrl && url && url.split('/').indexOf(advertiseUrl) !== -1) {
        return url;
      }
      return '';
    }).filter((url: string | undefined) => url !== undefined && url !== '');
    if (process.env.NODE_ENV === 'development') {
      io.to(data.clientId).emit('creator list from server', fullUrl[0] ? socketInfo[fullUrl[0]] : null);
    } else if (process.env.NODE_ENV === 'production') {
      io.to(data.clientId).emit('creator list from server', fullUrl[0] ? socketInfo[fullUrl[0]] : null);
    }
  });

  socket.on('live commerce image', (data: ImageData) => {
    const { roomName } = data;
    io.to(roomName).emit('get live commerce image', data);
  });

  socket.on('purshase alarm', (data: TextData) => {
    const { roomName } = data;
    const { text } = data;
    io.to(roomName).emit('get chat', text);
  });

  socket.on('bottom purchase message', (data: PurchaseMessage) => {
    const { roomName } = data;
    const { userId } = data;
    const { text } = data;
    const completeText = `${text} [${userId}]`;
    io.to(roomName).emit('get bottom purchase message', completeText);
    io.to(roomName).emit('get top-left ranking', data);
  });

  socket.on('right-top-purchase-message', async (data: PurchaseMessage) => {
    const { roomName } = data;

    const bottomTextArray:string[] = []
    const selectQuery = `
                          SELECT nickname, sum(quantity) AS total 
                          FROM liveCommerceRanking 
                          GROUP BY nickname 
                          ORDER BY total desc,
                          id
                          LIMIT 3`
    
    const selectTotalQuery = `SELECT SUM(quantity) AS currentQuantity FROM liveCommerceRanking`
    const textSelectQuery = `SELECT nickname, text FROM liveCommerceRanking`

    const [orderedRanking, totalQuantity, bottomText] = await Promise.all([
      doQuery(selectQuery),
      doQuery(selectTotalQuery),
      doQuery(textSelectQuery)
    ])
    bottomText.result.map((data:{nickname:string; text:string}) => {
      bottomTextArray.push(`${data.text} - [${data.nickname}]`)
    })

    const audioBuffer = await googleTextToSpeech(data)
    
    io.to(roomName).emit('get right-top purchase message', [data, audioBuffer]);
    io.to(roomName).emit('get top-left ranking', orderedRanking.result);
    io.to(roomName).emit('get current quantity', totalQuantity.result[0].currentQuantity);
    io.to(roomName).emit('get bottom purchase message', bottomTextArray);
  });

  socket.on('clear bottom area from admin', (data: TextData) => {
    const { roomName } = data;
    io.to(roomName).emit('clear bottom area to client');
    // io.to(roomName).emit('clear ranking area');
  });

  socket.on('show bottom area from admin', (data: TextData) => {
    const { roomName } = data;
    io.to(roomName).emit('show bottom area to client');
  });

  socket.on('bottom area message', (data: TextData) => {
    const { roomName } = data;
    const { text } = data;
    io.to(roomName).emit('get bottom area message', text);
  });

  socket.on('show live commerce', (roomName: string) => {
    io.to(roomName).emit('show screen');
  });

  socket.on('quit live commerce', (roomName: string) => {
    io.to(roomName).emit('clear screen');
  });

  socket.on('show virtual ad', (roomName: string) => {
    io.to(roomName).emit('show virtual ad to client');
  });

  socket.on('quantity object', (data:any) => {
    const {roomName} = data;
    const {quantityObject} = data;
    io.to(roomName).emit('quantity object from server', quantityObject)
  })

  socket.on('get all data', async (roomName:string) => {
    const bottomTextArray:string[] = []

    const selectQuery = `
                          SELECT nickname, sum(quantity) AS total 
                          FROM liveCommerceRanking 
                          GROUP BY nickname 
                          ORDER BY total desc,
                          id
                          LIMIT 3`
    
    const selectTotalQuery = `SELECT SUM(quantity) AS currentQuantity FROM liveCommerceRanking`
    const textSelectQuery = `SELECT nickname, text FROM liveCommerceRanking`

    const [orderedRanking, totalQuantity, bottomText] = await Promise.all([
      doQuery(selectQuery),
      doQuery(selectTotalQuery),
      doQuery(textSelectQuery)
    ])

    bottomText.result.map((data:{nickname:string; text:string}) => {
      bottomTextArray.push(`${data.text} - [${data.nickname}]`)
    })
    
    io.to(roomName).emit('get top-left ranking', orderedRanking.result);
    io.to(roomName).emit('get current quantity', totalQuantity.result[0].currentQuantity);
    io.to(roomName).emit('get bottom purchase message', bottomTextArray);
  })
  
  interface DateData{
    date:string;
    roomName:string;
  }

  socket.on('get d-day', (dateData:DateData) => {
    const { date } = dateData;
    const { roomName } = dateData;
    io.to(roomName).emit('d-day from server', date)
  })

  socket.on('refresh', (roomName:string) => {
    io.to(roomName).emit('refresh signal', roomName)
  })
});
  

httpServer.listen(PORT, () => {
  console.log(`--LIVE COMMERCE SERVER Ver.210716-- \nMODE : [${process.env.NODE_ENV}] \nPORT : ${PORT}\n`);
});
