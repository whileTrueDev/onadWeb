const express = require('express');
const doQuery = require('../../../../model/doQuery');
const ipToGeoData = require('../../../../middlewares/geoip/ipToGeoData');

const router = express.Router();

router.get('/', (req, res) => {
  const marketerId = req._passport.session.user.userid;

  const query = `SELECT *
  FROM landingClickIp
  WHERE SUBSTRING_INDEX(campaignId, "_", 1) = ?`;
  const queryArray = [marketerId];
  doQuery(query, queryArray)
    .then((row) => {
      const result = [];
      row.result.map((click) => {
        if (click.ipAddress) {
          const geo = ipToGeoData(click.ipAddress);
          if (geo) { result.push(geo); }
        }
        return click;
      });

      res.send(result);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

router.get('/campaign', (req, res) => {
  const { campaignId } = req.query;

  const query = 'SELECT * FROM landingClickIp WHERE campaignId = ?;';
  const queryArray = [campaignId];
  doQuery(query, queryArray)
    .then((row) => {
      const result = [];
      row.result.map((click) => {
        if (click.ipAddress) {
          const geo = ipToGeoData(click.ipAddress);
          if (geo) { result.push(geo); }
        }
        return click;
      });

      res.send(result);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

module.exports = router;
