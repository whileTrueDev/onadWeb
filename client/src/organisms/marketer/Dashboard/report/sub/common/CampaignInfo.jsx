import React from 'react';
import { Typography, Grid } from '@material-ui/core';

/**
 * 우선 순위 타입넘버에 해당하는 문자열 반환
 * @param {number} type 우선순위 타입넘버
 * @return // 0: CPM, 1: CPC + CPM, 2: CPC
 */
function getOptionType(type) {
  let result;
  if (type === 0) {
    result = '배너광고';
  }
  if (type === 1) {
    result = '배너광고 + 클릭광고';
  }
  if (type === 2) {
    result = '클릭광고';
  }
  return result;
}

/**
 * 광고 유형 타입넘버에 해당하는 문자열 반환
 * @param {number} type 광고유형 타입넘버
 * @return 0: '크리에이터 우선', 1: '카테고리 우선', 2: '노출우선'
 */
function getPriorityType(type) {
  let result;
  if (type === 0) {
    result = '크리에이터 우선';
  }
  if (type === 1) {
    result = '카테고리 우선';
  }
  if (type === 2) {
    result = '노출우선';
  }
  return result;
}

function makeContent(selectedCampaign) {
  return [
    { topic: '캠페인 명', value: selectedCampaign.campaignName },
    { topic: '캠페인 상태', value: selectedCampaign.onOff ? '운용중' : '중지' },
    {
      topic: '송출 우선순위',
      value: getPriorityType(selectedCampaign.priorityType)
    },
    { topic: '캠페인 유형', value: getOptionType(selectedCampaign.optionType) },
    { topic: '캠페인 생성 날짜', value: new Date(selectedCampaign.regiDate).toLocaleString() },
    { topic: '', value: '' },
  ];
}

export default function CampaignInfo(props) {
  const { selectedCampaign } = props;
  const data = makeContent(selectedCampaign);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <div style={{ maxWidth: 320, maxHeight: 160, marginBottom: '16px' }}>
          <Typography variant="h6">배너 이미지</Typography>
          <img
            style={{
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              display: 'block',
            }}
            src={selectedCampaign.bannerSrc}
            alt={selectedCampaign.campaignName}
          />
        </div>
      </Grid>
      {data.map(d => (
        <Grid item xs={6} sm={3} key={d.topic}>
          <Typography variant="h6">{d.topic}</Typography>
          <Typography variant="body2">
            {d.value}
          </Typography>
        </Grid>
      ))}

    </Grid>
  );
}
