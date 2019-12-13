const axios = require('axios');
const gameDict = require('./models/gameCategorieDic');
const doQuery = require('./models/doQuery');

// router는
// service - routes - socket - socket.js에 존재함.

module.exports = function (sql, socket, msg) {
  const fullUrl = msg[0];
  const cutUrl = `/${fullUrl.split('/')[4]}`;
  const prevBannerName = msg[1];

  axios.post('/url', { cutUrl, prevBannerName })
    .then((res) => {
      const { route, data } = res.data;
      switch (route) {
        case 'img receive': {
          socket.emit('img receive', [data[0], [data[1], data[2]]]);
          return;
        }
        case 'img clear': {
          socket.emit('img clear', []);
          return;
        }
        default: {
          socket.emit('url warning', []);
        }
      }
    });
};
