const express = require('express');
const doQuery = require('../../../../model/doQuery');

const { preprocessingBannerData } = require('../../../../middlewares/preprocessingData/');

const router = express.Router();

// 크리에이터 현재 광고 중 배너
router.get('/current', (req, res) => {
  const { creatorId } = req._passport.session.user;
  // DB연결후 query문을 통한 데이터 삽입
  const queryState = `
  SELECT mi.marketerName, br.bannerSrc, br.bannerDescription
  FROM campaign as cp

  JOIN bannerRegistered as br
  ON cp.bannerId = br.bannerId

  JOIN marketerInfo as mi
  ON cp.marketerId = mi.marketerId

  JOIN campaignTimestamp as ct
  ON  cp.campaignId = ct.campaignId
  
  WHERE cp.onOff = 1
  AND ct.creatorId = ?
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
  const { campaignId } = req.body;
  const { creatorId } = req._passport.session.user;
  const searchQuery = `
  SELECT banList 
  FROM creatorCampaign 
  WHERE creatorId = ?`;

  const saveQuery = `
  UPDATE creatorCampaign 
  SET banList = ? 
  WHERE creatorId = ?`;

  doQuery(searchQuery, [creatorId])
    .then((row) => {
      const jsonData = JSON.parse(row.result[0].banList);
      const newCampaignList = jsonData.campaignList.concat(campaignId);
      jsonData.campaignList = newCampaignList;
      doQuery(saveQuery, [JSON.stringify(jsonData), creatorId])
        .then(() => {
          res.send([true]);
        })
        .catch((errorData) => {
          console.log(errorData);
          res.send([false, '배너 삭제에 실패하였습니다 잠시후 시도해주세요.']);
        });
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

// 캠페인 ID array 를 통해 각 캠페인 ID에 따른 cash를 구하는 함수.
// banList에 존재할 때 state 또한 변경하는 함수.
const getCash = async ({ campaignList, banList }) => {
  const cashQuery = `
  SELECT campaignId, type, sum(cashToCreator)  as cash
  FROM campaignLog
  WHERE campaignId = ?  AND creatorId = ?
  GROUP by campaignLog.type
  `;
  const newList = [];
  await Promise.all(
    campaignList.map((campaignData) => {
      const newCampaignData = { ...campaignData, CPC: 0, CPM: 0 };
      return doQuery(cashQuery, [campaignData.campaignId, campaignData.creatorId])
        .then((row) => {
          if (row.result) {
            if (banList.includes(newCampaignData.campaignId)) {
              newCampaignData.state = 0;
            }
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
        })
        .catch((err) => {
          console.log(err);
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
  SELECT CT.campaignId, CT.date, BR.bannerSrc, CT.creatorId, campaign.connectedLinkId,
  campaign.onOff as state, campaign.marketerName, 
  bannerDescription, IR.links
  FROM 
  (
  SELECT creatorId, campaignId , min(date) as date 
  FROM campaignTimestamp
  WHERE creatorId = ?
  GROUP BY campaignId
  ) AS CT 
  JOIN campaign 
  ON CT.campaignId = campaign.campaignId
  JOIN bannerRegistered AS BR
  ON campaign.bannerId = BR.bannerId
  LEFT JOIN linkRegistered AS IR
  ON connectedLinkId = IR.linkId
  `;

  const banQuery = `
  SELECT banList 
  FROM creatorCampaign
  WHERE creatorId = ?
  `;

  Promise.all([
    doQuery(listQuery, [creatorId]),
    doQuery(banQuery, [creatorId])
  ])
    .then(async ([row, ban]) => {
    // banList를 통해 캠페인의 완료를 체크하여 전달한다.
      const banList = JSON.parse(ban.result[0].banList).campaignList;
      const campaignList = await getCash({ campaignList: row.result, banList });
      res.send(campaignList);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.send([]);
    });
});


module.exports = router;
