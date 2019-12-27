const express = require('express');
const doQuery = require('../../../../model/doQuery');

const router = express.Router();

router.get('/', (req, res) => {
  const infoQuery = `
  SELECT *
  FROM creatorDetail
  left join 
  (
  select creatorId, creatorLogo, creatorName
  from creatorInfo
  )as B
  on creatorDetail.creatorId = B.creatorId
  WHERE viewer > 20
  AND rip > 0.5
  order by viewer desc`;

  doQuery(infoQuery)
    .then((row) => {
      res.send(row.result);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

router.get('/contents', (req, res) => {
  // const marketerId = req._passport.session.user.userid;
  const { creatorId } = req.query;

  const query = `
  SELECT
    creatorName, creatorTwitchId, creatorLogo, contentsGraphData
  FROM creatorDetail AS cc
  JOIN creatorInfo AS ci
  ON ci.creatorId = cc.creatorId
  WHERE cc.creatorId = ?`;

  const queryArray = [creatorId];
  doQuery(query, queryArray).then((row) => {
    if (!row.error && row.result) {
      if (row.result.length > 0) {
        const result = row.result.map(r => ({
          ...r,
          contentsGraphData: JSON.parse(r.contentsGraphData)
        }));
        res.send(result[0]);
      } else {
        res.send(null);
      }
    }
  });
});

router.get('/hours', (req, res) => {
  const { creatorId } = req.query;

  const query = `
  SELECT creatorName, timeGraphData
  FROM creatorDetail AS cc
  JOIN creatorInfo AS ci
  ON ci.creatorId = cc.creatorId
  WHERE cc.creatorId = ?`;

  const queryArray = [creatorId];
  doQuery(query, queryArray).then((row) => {
    if (!row.error && row.result) {
      if (row.result.length > 0) {
        const result = row.result.map(r => ({
          ...r,
          timeGraphData: JSON.parse(r.timeGraphData)
        }));
        res.send(result[0]);
      } else {
        res.send(null);
      }
    }
  });
});

router.get('/viewerheatmap', (req, res) => {
  const { creatorId } = req.query;

  const query = `
  SELECT creatorName, viewerHeatmapData
  FROM creatorDetail AS cc
  JOIN creatorInfo AS ci
  ON ci.creatorId = cc.creatorId
  WHERE cc.creatorId = ?`;

  const queryArray = [creatorId];

  doQuery(query, queryArray).then((row) => {
    if (!row.error && row.result) {
      if (row.result.length > 0) {
        const result = row.result.map(r => ({
          ...r,
          viewerHeatmapData: JSON.parse(r.viewerHeatmapData)
        }));
        res.send(result[0]);
      } else {
        res.send(null);
      }
    }
  });
});

module.exports = router;
