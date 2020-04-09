"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const app = express_1.default();
const httpServer = http_1.default.createServer(app);
app.use('/public', express_1.default.static(`${__dirname}/public`));
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.get('/', (req, res) => {
    res.render('index.ejs');
});
httpServer.listen(3030, () => {
    console.log(`node_websocket server on ${process.env.NODE_ENV} mode`);
});
//# sourceMappingURL=app.js.map