import React from 'react';
import { Typography, Grid, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CampaignInterface } from '../../dashboard/interfaces';
import OnadBanner from '../../../../../atoms/Banner/OnadBanner';

/**
 * 우선 순위 타입넘버에 해당하는 문자열 반환
 * @param {number} type 우선순위 타입넘버
 * @return // 0: CPM, 1: CPC + CPM, 2: CPC
 */


const useStyles = makeStyles(() => ({
  typo: { fontWeight: 600, textAlign: 'right' },
  divider: { marginBottom: 10 },
  container: { maxWidth: 320, maxHeight: 160, marginBottom: 48 },
  divierHalf: { marginBottom: 5 },
  img: {
    width: 320,
    height: 160,
    overflow: 'hidden',
    display: 'block',
  }
}));


function getOptionType(type: number): string {
  let result = '';
  if (type === 0) {
    result = '배너광고';
  }
  if (type === 1) {
    result = '생방송 배너 광고';
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
function getPriorityType(type: number): string {
  let result = '';
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

function makeContent(selectedCampaign: CampaignInterface): { topic: string; value: string }[] {
  return [
    { topic: '캠페인 명', value: selectedCampaign.campaignName },
    { topic: '캠페인 상태', value: selectedCampaign.onOff ? '운용중' : '중지' },
    {
      topic: '송출 우선순위',
      value: getPriorityType(selectedCampaign.priorityType)
    },
    { topic: '캠페인 유형', value: getOptionType(selectedCampaign.optionType) },
    { topic: '캠페인 생성 날짜', value: new Date(selectedCampaign.regiDate).toLocaleString() },
  ];
}

interface CampaignInfoProps {
  selectedCampaign: CampaignInterface;
}

export default function CampaignInfo(props: CampaignInfoProps): JSX.Element {
  const { selectedCampaign } = props;
  const classes = useStyles();
  const data = makeContent(selectedCampaign);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <div className={classes.container}>
          <Typography variant="h5">배너 이미지</Typography>
          <Divider className={classes.divierHalf} />
          <OnadBanner
            className={classes.img}
            src={selectedCampaign.bannerSrc}
            alt={selectedCampaign.campaignName}
          />
        </div>
      </Grid>
      {data.map((d) => (
        <Grid item xs={6} sm={3} key={d.topic}>
          <Typography variant="h5">{d.topic}</Typography>
          {d.value && <Divider className={classes.divider} />}
          <Typography variant="h6" className={classes.typo}>
            {d.value}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
}
