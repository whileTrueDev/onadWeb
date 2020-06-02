import express from 'express';
import responseHelper from '../../middlewares/responseHelper';
import doQuery from '../../model/doQuery';
import { AdPickData } from './CpaTypes';

const router = express.Router();

// --------------------interface 정의--------------------------



// --------------------interface 정의 end--------------------------


// --------------------router 정의--------------------------

// 광고페이지의 소유 크리에이터 정보

//  1. creatorInfo
//  - creatorName
//  - creatorLogo
//  - creatorName
//  - creatorTwitchId
//  - creatorId

//  2. creatorLanding
//  - creatorBackgroundImage
//  - creatorTheme
//  - creatorTwitchId
//  - creatorDesc

//  3. creatorRoyaltyLevel
//  - level
//  - exp
//  - visitCount

router.route('/user')
  .get(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const name = responseHelper.getParam('name', 'get', req);
      const query = `
      select cli.*, crl.level, crl.exp, visitCount
      from 
      (
      select ci.*, creatorBackgroundImage, creatorTheme, creatorDesc
      from 
      (
      select 
      creatorName, creatorLogo, creatorTwitchId, creatorId
      from creatorInfo 
      WHERE creatorTwitchId = ? 
      ) as ci
      join 
      (
      select 
      creatorBackgroundImage, creatorTheme, creatorTwitchId, creatorDesc
      from creatorLanding 
      WHERE creatorTwitchId = ?
      ) as cl
      on ci.creatorTwitchId = cl.creatorTwitchId 
      ) 
      as cli
      join creatorRoyaltyLevel as crl
      on cli.creatorId = crl.creatorId
      `;

      doQuery(query, [name, name])
        .then((row) => {
          responseHelper.send({ error: null, result: row.result[0] }, 'get', res);
        }).catch((error) => {
          responseHelper.promiseError(error, next);
        });
    })
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/clicks')
  .get(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const name = responseHelper.getParam('name', 'get', req);
      const query = `
      SELECT IFNULL(tc.tcc,0) as totalClickCount , ci.creatorId
      FROM
      ( 
      SELECT count(*) as tcc, creatorId
      from campaignLog
      WHERE type = 'CPA' 
      group by creatorId 
      ) as tc
      RIGHT JOIN
      (
      SELECT creatorId
      FROM creatorInfo
      WHERE creatorTwitchId = ?
      ) AS ci
      on tc.creatorId = ci.creatorId
      `;
      const queryArray = [name];
      let lastResult;
      doQuery(query, queryArray)
        .then((row) => {
          const { error, result } = row;
          if (!error) {
            // 쿼리 과정에서 오류가 아닌 경우
            if (result.length > 0) {
              // 쿼리 결과가 있는 경우
              lastResult = { error: null, result: row.result[0] };
              responseHelper.send(lastResult, 'get', res);

            } else {
              // 쿼리 결과가 없는 경우
              lastResult = { error: true, result: null, };
              responseHelper.send(lastResult, 'get', res);

            }
          } else {
            // 쿼리 과정에서 오류인 경우
            lastResult = { error: true, result: error, };
            responseHelper.send(lastResult, 'get', res);

          }
        }).catch((reason) => {
          // db 쿼리 수행 과정의 오류인 경우
          console.log(`ERROR - [${new Date().toLocaleString()}] - /clicks\n`, reason);
          lastResult = { error: true, reason };
          responseHelper.send(lastResult, 'get', res);

        });
    })
  )
  .all(responseHelper.middleware.unusedMethod);


router.route('/campaigns')
  .get(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const name = responseHelper.getParam('name', 'get', req);
      const nameQuery =
        `
      SELECT creatorId 
      FROM creatorInfo
      WHERE creatorTwitchId = ?
      `
      // 크리에이터: 수익금의 40%를 가져가므로.
      const query = `
      SELECT adlist.*,  mylist.campaignId, mylist.creatorId
      FROM 
      (
      SELECT *, SUBSTR(campaignId, 8) as adId 
      FROM adpageClick
      WHERE creatorId = ?
      AND state = 1
      ) AS mylist
      JOIN 
      (
      SELECT 
      id, apOffer, apType, apCategory,
      apPackage, apItemid, apAppTitle,
      apHeadline, apVideo, apDailyCap,
      apRemain, apAppPromoText, apKPI,
      apPartner, apImages, apTrackingLink,
      apHook, apEvent, FORMAT(apPayout * (4/10), 0) AS apPayout,
      apIOSPayout, createdAt, updatedAt
      FROM adPickCampaign
      WHERE createdAt > DATE_SUB(NOW(), INTERVAL 10 minute)
      AND apRemain > 5
      ) AS adlist
      on mylist.adId = adlist.apOffer
      `;
      const id = await doQuery(nameQuery, [name]);
      const { creatorId } = id.result[0];
      const row = await doQuery<AdPickData[]>(query, [creatorId]);
      if (!row.error) {
        const result = row.result.map((r) => ({ ...r, apImages: JSON.parse(r.apImages as string) }));
        responseHelper.send({ error: null, result }, 'get', res);
      } else {
        responseHelper.send({ error: true, result: null }, 'get', res);
      }
    })
  )
  .all(responseHelper.middleware.unusedMethod);



router.route('/visit')
  .post(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const name = responseHelper.getParam('name', 'post', req);
      const userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
      const VISIT_TYPE_NUM = 0; // db에서 방문의 type 넘버
      // ip 체크가 1시간 이내에 찍힌게 있는지 확인

      const ipInsertQuery = `
        INSERT INTO adpageClickIp  (creatorId, ipAddress, type)
        VALUES (
        (SELECT creatorId FROM creatorInfo WHERE creatorTwitchId = ?), ?, ?)
        `;
      const ipInsertArray = [name, userIp, VISIT_TYPE_NUM];

      // <랜딩페이지 입장>클릭 수 증가쿼리
      const visitUpdateQuery = `
        UPDATE creatorRoyaltyLevel
        SET visitCount = visitCount + ?
        WHERE creatorId = (SELECT creatorId FROM creatorInfo WHERE creatorTwitchId = ?)`;
      const visitUpdateArray = [1, name];

      let lastResult = {
        error: null,
        result: { ipCheck: {}, ipInsert: {}, visitUpdate: {} }
      };

      Promise.all([
        doQuery(ipInsertQuery, ipInsertArray)
          .then((ipInsertRow) => {
            const { error, result } = ipInsertRow;
            if (!error) { // 쿼리 과정에서 오류가 아닌 경우
              if (result) { // 쿼리 결과가 존재하는 경우
                lastResult.result.ipCheck = { error: null, result: result };
              } else { // 쿼리 결과가 없는 경우
                lastResult.result.ipCheck = { error: true, result: null };
              }
            } else { // 쿼리 과정에서 오류인 경우
              lastResult.result.ipCheck = { error: true, result: error };
            }
          })
          .catch((reason) => { // db 쿼리 수행 과정의 오류인 경우
            lastResult.result.ipCheck = { error: true, reason };
          }),
        doQuery(visitUpdateQuery, visitUpdateArray)
          .then((clickUpdateRow) => {
            const { error, result } = clickUpdateRow;
            if (!error) { // 쿼리 과정에서 오류가 아닌 경우
              if (result) { // 쿼리 결과가 있는 경우
                lastResult.result.visitUpdate = { error: null, result: result };
              } else { // 쿼리 결과가 없는 경우
                lastResult.result.visitUpdate = { error: true, result: null };
              }
            } else { // 쿼리 과정에서 오류인 경우
              lastResult.result.visitUpdate = { error: true, result: error };
            }
          })
          .catch((reason) => { // db 쿼리 수행 과정의 오류인 경우
            lastResult.result.visitUpdate = { error: true, reason };
          })
      ])
        .then(() => {
          responseHelper.send(lastResult, 'post', res);
        });
    })
  )
  .all(responseHelper.middleware.unusedMethod);


// 테이블에 맞게 추가 수정 필요함.
router.route('/banner/click')
  .post(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const TRANSFER_TYPE_NUM = 2; // db에서 이동의 type 넘버
      const userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
      const [campaignId, creatorId] = responseHelper.getParam(['campaignId', 'creatorId'], 'post', req);

      // Queries
      // ip 체크가 1시간 이내에 찍힌게 있는지 확인
      const ipCheckQuery = `
      SELECT ipAddress
      FROM adpageClickIp
      WHERE campaignId = ?
      AND date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      AND type = ? AND ipAddress = ?
      `;
      const ipCheckArray = [campaignId, TRANSFER_TYPE_NUM, userIp];

      const ipInsertQuery = `
      INSERT INTO adpageClickIp 
      (campaignId, creatorId, ipAddress, type)
      VALUES (?, ?, ?, ?)
      `;
      const ipInsertArray = [campaignId, creatorId, userIp, TRANSFER_TYPE_NUM];

      // <이동>클릭 수 증가쿼리 전환에 대한 추적을 어떻게 발생 
      const clickUpdateQuery = `
      UPDATE adpageClick
      SET clickCount = clickCount + ?
      WHERE campaignId = ? AND creatorId = ?`;
      const clickUpdateArray = [1, campaignId, creatorId];

      let lastResult = {
        error: null,
        result: {
          ipCheck: {},
          ipInsert: {},
          clickUpdate: {}
        }
      };

      doQuery(ipCheckQuery, ipCheckArray)
        .then((row) => {
          const { error, result } = row;
          if (!error) {
            if (result.length === 0) {
              lastResult.result.ipCheck = { error: null, result: 'success' };
              // 이전에 찍힌 ip가 없는 경우
              Promise.all([
                doQuery(ipInsertQuery, ipInsertArray)
                  .then((ipInsertRow) => {
                    const { error, result } = ipInsertRow;
                    if (!error) { // 쿼리 과정에서 오류가 아닌 경우
                      if (result) { // 쿼리 결과가 존재하는 경우
                        lastResult.result.ipCheck = { error: null, result: result };
                      } else { // 쿼리 결과가 없는 경우
                        lastResult.result.ipCheck = { error: true, result: null };
                      }
                    } else { // 쿼리 과정에서 오류인 경우
                      lastResult.result.ipCheck = { error: true, result: error };
                    }
                  })
                  .catch((reason) => { // db 쿼리 수행 과정의 오류인 경우
                    lastResult.result.ipCheck = { error: true, reason };
                  }),
                doQuery(clickUpdateQuery, clickUpdateArray)
                  .then((clickUpdateRow) => {
                    const { error, result } = clickUpdateRow;
                    if (!error) { // 쿼리 과정에서 오류가 아닌 경우
                      if (result) { // 쿼리 결과가 있는 경우
                        lastResult.result.clickUpdate = { error: null, result: result };
                      } else { // 쿼리 결과가 없는 경우
                        lastResult.result.clickUpdate = { error: true, result: null };
                      }
                    } else { // 쿼리 과정에서 오류인 경우
                      lastResult.result.clickUpdate = { error: true, result: error };
                    }
                  })
                  .catch((reason) => { // db 쿼리 수행 과정의 오류인 경우
                    lastResult.result.clickUpdate = { error: true, reason };
                  })
              ])
                .then(() => {
                  responseHelper.send(lastResult, 'post', res);
                });
            } else {
              responseHelper.send(lastResult, 'post', res);
            }
          }
        })
        .catch(() => {
          responseHelper.send(lastResult, 'post', res);
        });
    })
  )
  .all(responseHelper.middleware.unusedMethod);


router.route('/manplus/impression')
  .post(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const MANPOINT_IMPRESSION_NUM = 0;
      const userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
      const name = responseHelper.getParam('name', 'post', req);

      // ip체크쿼리
      const ipCheckQuery = `
      SELECT ipAddress
      FROM manpointClick
      WHERE type = ? AND ipAddress = ?
      AND date >= DATE_SUB(NOW(), INTERVAL 1 DAY)
      `;
      const ipCheckArray = [MANPOINT_IMPRESSION_NUM, userIp];

      const ipInsertQuery = `
      INSERT INTO manpointClick  (creatorId, ipAddress, type)
      VALUES (
      (SELECT creatorId FROM creatorInfo WHERE creatorTwitchId = ?), ?, ?)
      `;

      const ipInsertArray = [name, userIp, MANPOINT_IMPRESSION_NUM];
      doQuery(ipCheckQuery, ipCheckArray)
        .then((row) => {
          if (row.result.length > 0) {
            responseHelper.send(true, 'post', res);
            return
          }
          doQuery(ipInsertQuery, ipInsertArray)
            .then(() => {
              responseHelper.send(true, 'post', res);
            })
            .catch(() => {
              responseHelper.send(true, 'post', res);
            })
        })
        .catch((error) => {
          console.log(error);
          responseHelper.send(true, 'post', res);
        })
    })
  )
  .all(responseHelper.middleware.unusedMethod);


router.route('/manplus/click')
  .post(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const MANPOINT_CLICK_NUM = 1;
      const userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
      const [name, isSSP] = responseHelper.getParam(['name', 'isSSP'], 'post', req);

      if (isSSP) {
        console.log('SSP CLICK TRACKING');
      } else {
        console.log('HOUSE CLICK TRACKING');
      }

      // ip체크쿼리
      const ipCheckQuery = `
      SELECT ipAddress
      FROM manpointClick
      WHERE type = ? AND ipAddress = ?
      AND date >= DATE_SUB(NOW(), INTERVAL 1 DAY)
      `;
      const ipCheckArray = [MANPOINT_CLICK_NUM, userIp];

      const ipInsertQuery = `
      INSERT INTO manpointClick  (creatorId, ipAddress, type)
      VALUES (
      (SELECT creatorId FROM creatorInfo WHERE creatorTwitchId = ?), ?, ?)
      `;
      const ipInsertArray = [name, userIp, MANPOINT_CLICK_NUM];

      doQuery(ipCheckQuery, ipCheckArray)
        .then((row) => {
          if (row.result.length > 0) {
            responseHelper.send(true, 'post', res);
            return
          }
          doQuery(ipInsertQuery, ipInsertArray)
            .then(() => {
              responseHelper.send(true, 'post', res);
            })
            .catch(() => {
              responseHelper.send(true, 'post', res);
            })
        })
        .catch((error) => {
          console.log(error);
          responseHelper.send(true, 'post', res);

        })
    })
  )
  .all(responseHelper.middleware.unusedMethod);


// --------------------router 정의--------------------------


export default router;
