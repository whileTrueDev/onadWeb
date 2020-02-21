import express from 'express';

export default class RequestHandler {
  req: express.Request;
  res: express.Response;
  next: express.NextFunction;

  constructor(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    this.req = req;
    this.res = res;
    this.next = next;
  }


  // ( 1. 요청을 받는다. req 필요시 요청으로부터 온 데이터를 변수로 설정한다)
  checkAuth() {
    // session 체크 및 api_key 체크
  }

  getParams(targetParams: string[]) {
    // targetParams에 해당하는 파라미터 가져오기.
    console.log(targetParams);
  }

  // ( 2. 쿼리와 쿼리에 들어가는 변수를 선언한다 )
  getQuery() {}

  // ( 3. doQuery 또는 doTransacQuery를 통해 DB 작업을 실행한다.)
  doQuery() {

  }

  // ( 4. DB작업 이후 DB로부터의 응답에 따라 성공/실패 분기하여 요청자에게 응답한다.)
  sendResponse() {

  }
}
