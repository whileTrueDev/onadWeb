import { createLogger, format, transports } from 'winston';

import WinstonDaily from 'winston-daily-rotate-file';
import moment from 'moment';

const { combine, timestamp, prettyPrint } = format;

function timeStampFormat(): string {
  return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
}

// logger 설정
const logger = createLogger({
  format: combine(
    timestamp(),
    prettyPrint()
  ),
  transports: [
    new WinstonDaily({
      // name: 'exception-file',
      filename: './bin/log/exception_%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      // colorize: false,
      maxSize: 50000000,
      maxFiles: 1000,
      level: 'error',
      json: false,
    }),
    new WinstonDaily({
      // name: 'info-file',
      filename: './bin/log/info_%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      // colorize: false,
      maxSize: 50000000,
      maxFiles: 1000,
      level: 'info',
      json: false,
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
