const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();

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

module.exports = router;
