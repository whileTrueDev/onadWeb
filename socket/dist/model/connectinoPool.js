"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const port = typeof process.env.DB_PORT === 'string' ? Number(process.env.DB_PORT) : process.env.DB_PORT;
const dbconfig = {
    host: process.env.DB_HOST,
    port,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    charset: process.env.DB_CHARSET,
};
const pool = mysql_1.default.createPool(dbconfig);
exports.default = pool;
//# sourceMappingURL=connectinoPool.js.map