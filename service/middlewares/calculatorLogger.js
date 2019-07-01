var {createLogger, format, transports } = require('winston');
var winstonDaily = require('winston-daily-rotate-file');
var moment = require('moment');
 
const { combine, timestamp, prettyPrint  } = format;
function timeStampFormat() {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');                            
};

//logger 설정
const logger = createLogger({
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new winstonDaily({
            name: 'calculationLogger',
            filename: './bin/calculationLog/calculation_%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            colorize: true,
            maxsize: 50000000,
            maxFiles: 1000,
            level: 'info',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        })
    ]
});

module.exports = logger;