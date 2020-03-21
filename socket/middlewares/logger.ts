const { createLogger, format, transports } = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const moment = require('moment');

const { combine, timestamp, prettyPrint } = format;
function timeStampFormat() {
  return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
}

// logger 설정
const logger = createLogger({
  format: combine(
    timestamp(),
    prettyPrint()
  ),
  transports: [
    new winstonDaily({
      name: 'exception-file',
      filename: './bin/log/exception_%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      colorize: false,
      maxsize: 50000000,
      maxFiles: 1000,
      level: 'error',
      showLevel: true,
      json: false,
      timestamp: timeStampFormat
    }),
    new winstonDaily({
      name: 'info-file',
      filename: './bin/log/info_%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      colorize: false,
      maxsize: 50000000,
      maxFiles: 1000,
      level: 'info',
      showLevel: true,
      json: false,
      timestamp: timeStampFormat
    }),
    // new transports.Console({
    //     name: 'debug-console',
    //     colorize: true,
    //     level: 'debug',
    //     showLevel: true,
    //     json: false,
    //     timestamp: timeStampFormat
    // })
  ]
});

export default logger;
