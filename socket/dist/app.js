"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
dotenv_1.default.config();
const doQuery_1 = __importDefault(require("./models/doQuery"));
const callImg_1 = __importDefault(require("./public/callImg"));
const app = express_1.default();
const httpServer = http_1.default.createServer(app);
const io = socket_io_1.default(httpServer);
const PORT = 3002;
process.env.NODE_ENV = (process.env.NODE_ENV && (process.env.NODE_ENV).trim().toLowerCase() === 'production') ? 'production' : 'development';
let SOCKET_HOST = process.env.DEV_SOCKET_HOSTNAME;
if (process.env.NODE_ENV === 'production') {
    SOCKET_HOST = process.env.PRODUCTION_SOCKET_HOSTNAME;
}
app.use('/public', express_1.default.static(`${__dirname}/public`));
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.get('/', (req, res) => {
    res.send(200);
});
app.get('/wrongurl', (req, res) => {
    res.render('wrongUrl.ejs');
});
app.get('/browserwarn', (req, res) => {
    res.render('browserWarn.ejs');
});
app.get('/banner/:id', (req, res, next) => {
    res.render('client.ejs');
});
io.on('connection', (socket) => {
    console.log('SOCKET ON');
    socket.on('new client', (msg) => {
        const CLIENT_URL = msg[0];
        const HISTORY = msg[1];
        if (process.env.NODE_ENV === 'development') {
            socket.join('banner room');
            socket.emit('host pass', SOCKET_HOST);
            console.log(CLIENT_URL);
            callImg_1.default(socket, [CLIENT_URL, '']);
        }
        else if (HISTORY !== 1) {
            const destination = `${SOCKET_HOST}/browserWarn`;
            socket.emit('browser warning', destination);
        }
        else {
            socket.join('banner room');
            socket.emit('host pass', SOCKET_HOST);
            callImg_1.default(socket, [CLIENT_URL, '']);
        }
    });
    socket.on('write to db', (msg) => {
        const campaignId = msg[0][0];
        const creatorId = msg[0][1];
        const program = msg[1];
        const writeQuery = 'INSERT INTO campaignTimestamp (campaignId, creatorId, program) VALUES (?, ?, ?);';
        doQuery_1.default(writeQuery, [campaignId, creatorId, program]);
    });
    socket.on('re-render', (msg) => {
        callImg_1.default(socket, msg);
    });
    socket.on('hiddenTest', (msg) => { console.log(msg); });
    socket.on('showTest', (msg) => { console.log(msg); });
});
httpServer.listen(PORT, () => {
    console.log(`node_websocket server on ${process.env.NODE_ENV} mode`);
});
//# sourceMappingURL=app.js.map