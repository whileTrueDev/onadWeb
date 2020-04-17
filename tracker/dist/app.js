"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const adchat_1 = __importDefault(require("./public/tracker/adchat"));
const app = express_1.default();
const httpServer = http_1.default.createServer(app);
const PORT = 3030;
process.env.NODE_ENV = (process.env.NODE_ENV && (process.env.NODE_ENV).trim().toLowerCase() === 'production') ? 'production' : 'development';
let TRACKER_HOST = process.env.DEV_TRACKER_HOSTNAME;
if (process.env.NODE_ENV === 'production') {
    TRACKER_HOST = process.env.PRODUCTION_TRACKER_HOSTNAME;
}
app.use('/public', express_1.default.static(`${__dirname}/public`));
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.get('/:costType/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { costType } = req.params;
    const userData = req.query;
    const redirection = yield adchat_1.default(req, res, userData, [id, costType]);
    res.render('index.ejs');
}));
httpServer.listen(PORT, () => {
    console.log(`tracking server on ${process.env.NODE_ENV} mode`);
});
//# sourceMappingURL=app.js.map