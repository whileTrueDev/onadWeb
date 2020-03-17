"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const connectinoPool_1 = __importDefault(require("./connectinoPool"));
const doQuery = (query, queryArray) => new Promise((resolve, reject) => {
    connectinoPool_1.default.getConnection((err, conn) => {
        if (err) {
            console.log('conn in err - getConnection 함수', conn);
            console.log(`DB연결 오류 ${err.message}`);
            reject(new http_errors_1.default[500](err.message));
        }
        else {
            conn.query(query, queryArray, (error, result) => {
                if (error) {
                    conn.release();
                    reject(new http_errors_1.default[500](error.sqlMessage));
                }
                else {
                    conn.release();
                    resolve({ result });
                }
            });
        }
    });
});
exports.default = doQuery;
//# sourceMappingURL=doQuery.js.map