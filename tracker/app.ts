/* eslint-disable import/first */
// import dotenv from 'dotenv';

// dotenv.config();
import express from 'express';
import http from 'http';

const app = express();
const httpServer = http.createServer(app);

app.use('/public', express.static(`${__dirname}/public`)); // 디렉토리 정적으로 고정하는 부분
// view engine
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
  res.render('index.ejs');
});

httpServer.listen(3030, () => {
  console.log(`node_websocket server on ${process.env.NODE_ENV} mode`);
});
