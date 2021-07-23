interface Query {
  [key: string]: string;
}

const query: Query = {
  creatorCampaign: 'SELECT campaignList FROM creatorCampaign WHERE creatorId = ?;',
  activeCampaign: `
      SELECT campaignId, campaignName, optionType, startDate, finDate, selectedTime, campaignDescription, cashAmount
        FROM campaign
        LEFT JOIN marketerInfo ON campaign.marketerId = marketerInfo.marketerId
        LEFT JOIN marketerDebit ON campaign.marketerId = marketerDebit.marketerId
      WHERE
      (marketerInfo.marketerContraction = 1 AND campaign.onOff = 1 AND campaign.optionType = 1 AND campaign.limitState = 0)
        OR (marketerInfo.marketerContraction = 1 AND campaign.onOff = 1 AND campaign.optionType = 3)
    `,
  categoryCampaign: 'SELECT campaignList FROM categoryCampaign WHERE categoryId = ?',
  twitchGameIdForCreator: `
  SELECT gameId FROM twitchStreamDetail AS tsd 
  WHERE streamId = (
    SELECT streamId FROM twitchStream
    JOIN creatorInfo ON creatorTwitchOriginalId = streamerId
    WHERE creatorId = ?
    ORDER BY startedAt DESC LIMIT 1
  ) AND time > DATE_SUB(NOW(), INTERVAL 10 MINUTE)
  ORDER BY tsd.time DESC LIMIT 1;`,
  afreecaGameIdForCreator: `
  SELECT broadCategory AS gameId FROM AfreecaBroadDetail AS ABD
  WHERE broadId = (
    SELECT broadId FROM AfreecaBroad JOIN creatorInfo ON afreecaId = userId
    WHERE creatorId = ? ORDER BY broadStartedAt DESC LIMIT 1
  ) AND createdAt > DATE_SUB(NOW(), INTERVAL 10 MINUTE)
  ORDER BY createdAt DESC LIMIT 1
  `,
  banAndPausedCampaign: `
  SELECT banList, pausedList
  FROM creatorCampaign
  WHERE creatorId = ?
  `,
  bannerSrc: `
  SELECT br.bannerSrcUrl AS bannerSrc
  FROM campaign
  JOIN bannerRegistered as br
  ON br.bannerId = campaign.bannerId
  WHERE campaign.campaignId = ?
  `,
  linkUrl: `
  SELECT links 
  FROM linkRegistered 
  WHERE linkId = (SELECT connectedLinkId FROM campaign WHERE campaignId = ?) 
`,
  onadMallItemUrl: `SELECT itemSiteUrl
  FROM merchandiseMallItems
  JOIN campaign on campaign.merchandiseId = merchandiseMallItems.merchandiseId
  WHERE campaignId = ?`,
  creatorByUrl: `
  SELECT creatorId, creatorTwitchId, adChatAgreement, afreecaId
  FROM creatorInfo
  WHERE advertiseUrl = ?
`,
  insertTimestamp:
    'INSERT INTO campaignTimestamp (campaignId, creatorId, program) VALUES (?, ?, ?);',
  insertBannerVisiblePageApi:
    'INSERT INTO bannerVisible (advertiseUrl, visibleState, program, type) VALUES (?, ?, ?, 1);',
  insertBannerVisibleBannerClick:
    'INSERT INTO bannerVisible (advertiseUrl, visibleState, program, type) VALUES (?, ?, ?, 0);',
};

export default query;
