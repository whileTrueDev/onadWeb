
/**
 * Module dependencies.
 */

import dotenv from 'dotenv';

dotenv.config();

const debug = require('debug')('service:server');
const http = require('http');
const OnadWebApi = require('../app');// 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.

const onadapp = new OnadWebApi();

// Create HTTP server.
const server = http.createServer(onadapp.app);

const DEFAULT_PORT = 3000;
// Normalize a port into a number, string, or false.
function normalizePort(val: string): number {
  const port = parseInt(val, 10);
  if (port >= 0) {
    // port number
    return port;
  }
  return DEFAULT_PORT;
}
// Get port from environment and store in Express.
const PORT = normalizePort(process.env.PORT || '3000');
onadapp.app.set('port', PORT);

// Event listener for HTTP server "error" event.
function onError(error: any): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = `Port ${PORT}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
  console.log(`Listening on ${bind}`);
}

// Listen on provided port, on all network interfaces.
server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);
