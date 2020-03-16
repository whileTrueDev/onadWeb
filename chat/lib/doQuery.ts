import mysql, { MysqlError, PoolConnection } from 'mysql';

require('dotenv').config();

const port = typeof process.env.DB_PORT === 'string' ? Number(process.env.DB_PORT) : process.env.DB_PORT;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  charset: process.env.DB_CHARSET
});

export interface OkPacket {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  protocol41: boolean;
  changedRows: number;
}

/**
 * Promise API를 이용한 비동기식 DB접근을 동기식화 하여 쿼리의 결과값을 리턴하는 함수
 * @param {string} query 쿼리 string
 * @param {array} queryArray ? 에 해당하는 변수들을 요소로 가지는 array
 */
function doQuery<QueryResult = {}>(
  query: string, queryArray?: any[]
): Promise<{result: QueryResult; error: any}> {
  return new Promise((resolve, reject) => {
    pool.getConnection((err: MysqlError, conn: PoolConnection) => {
      if (err) { // 커넥션 시 에러발생
        console.log('conn in err - getConnection 함수', conn);
        reject(new Error(err.message));
      } else {
        conn.query(query, queryArray, (error, result: QueryResult) => {
          if (error) {
            conn.release();
            reject(new Error(error.sqlMessage));
          } else {
            conn.release();
            resolve({ error, result });
          }
        });
      }
    });
  });
}
export default doQuery;
