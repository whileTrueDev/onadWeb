const proxy = require('http-proxy-middleware');

const HOST = process.env.NODE_ENV === 'production' ? 'http://52.79.211.82:3000' : 'http://localhost:3000';

module.exports = (app) => {
  app.use(
    proxy('/api', {
      target: HOST,
      changeOrigin: true,
    }),
  );
  app.use(
    proxy('/images', {
      target: HOST,
      changeOrigin: true,
    }),
  );
};
