const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();

router.get('/landingurl/all', (req, res) => {
  const marketerId = req._passport.session.user.userid;
  const query = `
  SELECT
    linkId, marketerId, confirmState, denialReason,
    links, regiDate, updateDate FROM linkRegistered
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
    });
});

module.exports = router;
