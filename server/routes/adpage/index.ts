import express from 'express';
import responseHelper from '../../middlewares/responseHelper';
import doQuery from '../../model/doQuery';

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
      SELECT
      count(*) as bannerCount,
      sum(clickCount) as totalClickCount
      FROM adpageClick as lc
      JOIN creatorLanding as cl
      ON cl.creatorId = lc.creatorId
      WHERE creatorTwitchId = ?
      LIMIT 1
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


router.route('/banner')
  .get(
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const NOT_DELETED_CAMPAIGN_STATE = 0;
      const ON_STATE = 1;
      const name = responseHelper.getParam('name', 'get', req);
      const query = `
      SELECT
      bannerSrc, clickCount, mi.marketerName, campaign.campaignId, lc.creatorId,
      bannerDescription, companyDescription, links,
      DATE_FORMAT(lc.regiDate, "%Y년 %m월 %d일") as regiDate
      
      FROM adpageClick as lc

      JOIN marketerInfo as mi
        ON SUBSTRING_INDEX(lc.campaignId, "_", 1) = mi.marketerId
        
      JOIN creatorLanding as cl
        ON lc.creatorId = cl.creatorId
        
      JOIN campaign
        ON lc.campaignId = campaign.campaignId
        
      JOIN bannerRegistered as br
        ON campaign.bannerId = br.bannerId
        
      JOIN linkRegistered as  lr
        ON lr.linkId = campaign.connectedLinkId
        
      WHERE creatorTwitchId = ? AND campaign.deletedState = 0
        AND campaign.limitState != 1
        AND campaign.onOff = 1 AND mi.marketerContraction = 1
        AND campaign.optionType != 0
      ORDER BY regiDate DESC`;
      const queryArray = [name, NOT_DELETED_CAMPAIGN_STATE, ON_STATE, ON_STATE];

      let lastResult;


      doQuery(query, queryArray)
        .then((row) => {
          const { error, result } = row;
          if (!error) {
            // 쿼리 과정에서 오류가 아닌 경우
            if (result.length > 0) {
              // 쿼리 결과가 있는 경우
              lastResult = {
                error: null,
                result: row.result.map((r: any) => ({
                  ...r,
                  links: JSON.parse(r.links)
                }))
              };
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
          console.log(`ERROR - [${new Date().toLocaleString()}] - /banner\n`, reason);
          lastResult = { error: true, reason };
          responseHelper.send(lastResult, 'get', res);
        });
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

      // <이동>클릭 수 증가쿼리
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
