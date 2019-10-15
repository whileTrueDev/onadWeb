const express = require('express');
const doQuery = require('../../../../model/doQuery');

const { preprocessingBannerData } = require('../../../../middlewares/preprocessingData/');

const router = express.Router();

// 크리에이터 현재 광고 중 배너
router.get('/current', (req, res) => {
  const { creatorId } = req._passport.session.user;
  // DB연결후 query문을 통한 데이터 삽입
  const queryState = `
  SELECT mi.marketerName, br.bannerSrc, br.bannerDescription, br.companyDescription
  FROM campaign as cp

  JOIN bannerRegistered as br
  ON cp.bannerId = br.bannerId

  JOIN marketerInfo as mi
  ON cp.marketerId = mi.marketerId

  JOIN campaignTimestamp as ct
  ON  cp.campaignId = ct.campaignId
  
  WHERE cp.onOff = 1
  AND ct.date >= NOW() - INTERVAL 10 MINUTE
  ORDER BY ct.date DESC
  LIMIT 2`;

  doQuery(queryState, [creatorId])
    .then((row) => {
      const { result } = row;
      res.send(result);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

// 배너 정보
router.post('/desc', (req, res) => {
  const { contractionId } = req.body;
  const bannerId = contractionId.split('/')[0];
  const descQuery = `
  SELECT *
  FROM bannerRegistered
  WHERE bannerId = ?`;
  doQuery(descQuery, [bannerId])
    .then((row) => {
      res.send(row.result[0]);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

// 배너 삭제
router.post('/delete', (req, res) => {
  const { contractionId } = req.body;
  const bannerQuery = `
  DELETE FROM bannerMatched
  WHERE contractionId = ? `;
  doQuery(bannerQuery, [contractionId])
    .then(() => {
      res.send([true, '배너가 성공적으로 삭제되었습니다.']);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.send([false, '배너 삭제에 실패하였습니다 잠시후 시도해주세요.']);
    });
});

// 삭제 : closed beta 02!
// 크리에이터 광고 내역 라우터
router.get('/matched', (req, res) => {
  const { creatorId } = req._passport.session.user;
  const bannerQuery = `
  SELECT bm.contractionTime, mi.marketerName, bm.contractionState, br.bannerSrc, bm.contractionId
  FROM bannerMatched as bm
  JOIN bannerRegistered as br 
  ON SUBSTRING_INDEX(bm.contractionId, '/', 1) = br.bannerId
  JOIN marketerInfo as mi
  ON SUBSTRING_INDEX(br.bannerId, '_', 1) = mi.marketerId
  WHERE contractionId LIKE CONCAT('%', ?, '%')
  ORDER BY contractionTime DESC
  `;
  doQuery(bannerQuery, [creatorId])
    .then((row) => {
      if (row.result.length > 0) {
        const result = preprocessingBannerData(row.result);
        res.send(result);
      } else {
        res.end();
      }
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

// 하나의 gameId에 해당하는 모든 캠페인 리스트를 반환하는 Promise
const getCash = async (campaignList) => {
  console.log('캠페인 List 각각의 campaignId를 통해 cash를 가져옵니다.');
  const cashQuery = `
  SELECT campaignId, type , sum(cash) as cash
  FROM campaignLog
  WHERE campaignId = ? 
  AND creatorId = ?
  GROUP by campaignLog.type
  `;
  const newList = [];
  await Promise.all(
    campaignList.map((campaignData) => {
      const newCampaignData = { ...campaignData, CPC: 0, CPM: 0 };
      return doQuery(cashQuery, [campaignData.campaignId, campaignData.creatorId])
        .then((row) => {
          if (row.result) {
            let cash = 0;
            row.result.forEach((cashData) => {
              newCampaignData[cashData.type] = cashData.cash;
              cash += cashData.cash;
            });
            newCampaignData.cash = cash;
            newList.push(newCampaignData);
            const newDate = new Date(newCampaignData.date);
            newDate.setHours(newDate.getHours() + 9);
            newCampaignData.date = newDate.toLocaleString('ko-KR', {
              timeZone: 'UTC',
              hour12: false,
              year: '2-digit',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            });
          }
        });
    })
  )
    .catch((errorData) => {
      console.log(errorData);
      errorData.point = 'getCash()';
      errorData.description = 'categoryCampaign에서 각각의 categoryId에 따른 캠페인 가져오기';
    });

  return newList;
};

router.get('/list', (req, res) => {
  const { creatorId } = req._passport.session.user;
  const listQuery = `
  SELECT CT.campaignId, CT.date, BR.bannerSrc, CT.creatorId,
  campaign.onOff as state, campaign.marketerName, 
  bannerDescription, companyDescription,
  landingUrl
  FROM 
  (
  SELECT creatorId, campaignId , min(date) as date FROM campaignTimestamp
  WHERE creatorId = ?
  GROUP BY campaignId
  ) AS CT 

  JOIN campaign 
  ON CT.campaignId = campaign.campaignId

  JOIN bannerRegistered AS BR
  ON campaign.bannerId = BR.bannerId
  `;
  doQuery(listQuery, [creatorId])
    .then(async (row) => {
      const campaignList = await getCash(row.result);
      res.send(campaignList);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.send([]);
    });
});


module.exports = router;
