const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();

// 랜딩페이지url 데이터 조회
router.get('/landingurl/all', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const query = `
  SELECT
    linkId, marketerId, confirmState, denialReason,
    links, DATE_FORMAT(regiDate, "%Y년 %m월 %d일") as regiDate, updateDate
  FROM linkRegistered
  WHERE marketerId = ?
  `;
  const queryArray = [marketerId];

  doQuery(query, queryArray)
    .then((row) => {
      if (!row.error && row.result.length > 0) {
        const { result } = row;
        res.send(result.map(
          urlData => ({ ...urlData, links: JSON.parse(urlData.links) })
        ));
      } else if (row.result.length === 0) {
        res.send('nourldata');
      }
    }).catch((err) => {
      console.log('/landingurl/connectedcampaign - err ', err);
    });
});

// 랜딩페이지url 데이터 삭제
router.delete('/landingurl', (req, res) => {
  const { linkId } = req.body.data;
  const deleteQuery = `
  DELETE FROM linkRegistered 
  WHERE linkId = ?`;

  const deleteQueryArray = [linkId];

  doQuery(deleteQuery, deleteQueryArray)
    .then((row) => {
      if (!row.error && row.result.affectedRows > 0) {
        console.log(`DELETE - landingurl ${linkId}`, row.result);
        res.send([true]);
      } else if (row.error || (row.result && row.result.affectedRows) === 0) {
        res.send([false, '링크 삭제과정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요..']);
      }
    })
    .catch((err) => { console.log(`Error in DELETE - /landingurl ${err}`); });
});

// 랜딩페이지url 삭제시 - 연결된 캠페인 있는지 확인하기 위해 조회.
router.get('/landingurl/connectedcampaign', (req, res) => {
  const { linkId } = req.query;
  const query = `
  SELECT campaignId
  FROM campaign
  WHERE connectedlinkId = ?`;

  const queryArray = [linkId];
  doQuery(query, queryArray).then((row) => {
    if (!row.error) {
      res.send(row.result);
    }
  }).catch((err) => {
    console.log('/landingurl/connectedcampaign - err ', err);
  });
});

// 랜딩페이지url 등록
router.post('/landingurl/regist', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const { links } = req.body;
  const DEFAULT_CONFIRM_STATE = 0;
  const insertQuery = `
  INSERT INTO linkRegistered
  (linkId, marketerId, confirmState, links)
  VALUES (?, ?, ?, ?)
  `;

  // url 번호 매김을 위해 조회.
  const getLandingUrlQuery = `
  SELECT linkId
    FROM linkRegistered
    WHERE marketerId = ?
    ORDER BY regiDate DESC
    LIMIT 1`;
  const getLandingUrlArray = [marketerId];

  doQuery(getLandingUrlQuery, getLandingUrlArray)
    .then((row) => {
      if (!row.error) {
        // Make linkId.
        let linkId;
        if (row.result.length > 0) {
          const lastlinkId = row.result[0].linkId;
          const count = parseInt(lastlinkId.split('_')[2], 10) + 1;
          if (count < 10) {
            linkId = `link_${marketerId}_0${count}`;
          } else {
            linkId = `link_${marketerId}_${count}`;
          }
        } else { // 해당 마케터가 업로드한 첫 url인 경우
          linkId = `link_${marketerId}_01`;
        }

        // 랜딩페이지URL 적재
        doQuery(insertQuery, [linkId, marketerId, DEFAULT_CONFIRM_STATE, JSON.stringify({ links })])
          .then((row1) => {
            if (!row1.error) {
              res.send([true]);
            } else { res.send([false, '랜딩페이지URL 등록과정에서 오류가 발생했습니다. 다시 시도해보세요.']); }
          })
          .catch((err) => {
            console.log('Error in inventory/landingurl/regist - ', err);
          });
      }
    });
});


module.exports = router;
