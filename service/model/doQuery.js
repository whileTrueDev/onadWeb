// DB 커넥션 가져오기.
const pool = require('./connectionPool');
const logger = require('../middlewares/logger');

//에러 핸들링 및 DB 접속 후 쿼리 결과값 반환.
//비동기식 구현
const doQuery = (query, queryArray=[]) => {
  return new Promise((resolve, reject)=>{
    pool.getConnection((err, conn)=>{
      // 커넥션 시 에러발생
      if(err){
        conn.release();
        logger.error('DB연결 관련 오류' + err);
        reject({
          error : err,
          result : null,
        }); 
      }
      conn.query(query, queryArray, (error, result)=>{
        if(error){
          conn.release();
          logger.error('query 관련 오류 : ' + error);
          reject({
            error : error.sqlMessage,
            result : null,
          }); 
        }else{
          conn.release();
          logger.info(query);
          resolve({
            error : null,
            result : result,
          });
        }
      })
    })
  })
}

module.exports = doQuery;