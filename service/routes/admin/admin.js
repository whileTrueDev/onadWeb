// import
const express = require('express');
const doQuery = require('../../model/calculatorQuery');

const router = express.Router();


// 계약되어있는 크리에이터인지 확인된 리스트

router.get('/streams', (req, res) => {
  const date = new Date();
  // date.setHours(date.getHours() + 9);
  date.setMinutes(date.getMinutes() - 10);
  const selectQuery = `
  SELECT creatorTwitchId 
  FROM creatorInfo as CI
  JOIN 
  (SELECT streamerName 
  FROM twitchStreamDetail
  WHERE time > ?) as A
  ON CI.creatorName = A.streamerName
  WHERE creatorContractionAgreement  = 1
  `;
  doQuery(selectQuery, [date]).then((row) => {
    const retultList = row.result.map(creator => creator.creatorTwitchId);
    res.send(retultList);
  });
});

router.get('/banners', (req, res) => {
  const date = new Date();
  // date.setHours(date.getHours() + 9);
  date.setMinutes(date.getMinutes() - 10);
  // BR.bannerSrc
  const selectQuery = `
  SELECT CT.campaignId, BR.bannerId, CI.creatorName, BR.bannerSrc, CI.creatorLogo
  FROM 
  (
   SELECT campaignId, creatorId 
    FROM campaignTimestamp
    WHERE date > ?
  ) as CT
  JOIN campaign as CP
  ON CP.campaignId = CT.campaignId
  
  JOIN bannerRegistered as BR
  ON CP.bannerId = BR.bannerId
  
  JOIN creatorInfo as CI
  ON CT.creatorId = CI.creatorId
  `;
  doQuery(selectQuery, [date]).then((row) => {
    res.send(row.result);
  }).catch((errorData) => {
    console.log(errorData);
    res.send([]);
  });
});


module.exports = router;
