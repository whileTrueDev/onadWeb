/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();
import createError from 'http-errors';
import { MysqlError, PoolConnection } from 'mysql';
import { QueryResult } from '../@types/db';
import pool from './connectionPool'; // DB 커넥션 가져오기.
// const logger = require('../middlewares/logger');

/**
 * @description
  Promise API를 이용한 비동기식 DB접근을 동기식화 하여 쿼리의 결과값을 리턴하는 함수,
  Error 또는 query 성공시 Logger로 입력을 진행한다.
  1. 사용법
    - query문 을 사용하는 js파일에 conn.query() 대신 사용.
    - .then() 과 .catch()를 이용하여 Error 핸들링 및 query data 사용.
  2. 필수사항
    - 쿼리 내부의 가변적 변수는 무.조.건 `?` 로 선언 이후, queryArray 로 넣는다.

 * @param {string} query 쿼리 string
 * @param {array} queryArray ? 에 해당하는 변수들을 요소로 가지는 array
 * @author 박찬우
 */
const doQuery = (
  query: string,
  queryArray?: any[]
): Promise<QueryResult> => new Promise((resolve, reject) => {
  pool.getConnection((err: MysqlError, conn: PoolConnection) => {
    // 커넥션 시 에러발생
    if (err) {
      console.log('conn in err - getConnection 함수', conn);
      console.log(`DB연결 오류 ${err.message}`);
      // logger.error(`DB연결 관련 오류${err}`);
      reject(new createError[500](err.message));
    } else {
      conn.query(query, queryArray, (error, result) => {
        if (error) {
          conn.release();
          reject(new createError[500](error.sqlMessage));
        } else {
          conn.release();
          resolve({ result });
        }
      });
    }
  });
});

export default doQuery;
