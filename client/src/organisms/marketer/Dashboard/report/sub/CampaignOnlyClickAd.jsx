import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Grid, Divider, Typography,
} from '@material-ui/core';
import { Assignment } from '@material-ui/icons';
// own components
import ContentCard from './common/ContentCard';
import ReportCard from './common/ReportCard';
import InteractionHeatmap from './onlyClickSub/InteractionHeatmap';
import InteractionToGeo from './onlyClickSub/InteractionToGeo';
import CampaignInfo from './common/CampaignInfo';

const makeContents = reportData => ({
  price: [
    {
      title: '광고 총 비용',
      value: Number(parseInt(reportData.totalCPM, 10) + parseInt(reportData.totalCPC, 10)),
      unit: '원'
    },
    {
      title: '클릭광고 총 비용',
      value: Number(reportData.totalCPC),
      unit: '원'
    }
  ],
  effect: [
    {
      title: '배너 총 클릭 수',
      value: Number(reportData.totalClick),
      unit: '회'
    },
    {
      title: '홈페이지 이동 수',
      value: Number(reportData.totalTransfer),
      unit: '회'
    },
  ],
  metrics: [
    {
      title: '전환율',
      value: (reportData.totalTransfer / reportData.totalLandingView),
      unit: '%',
      decimalRange: 4
    },
    { title: '상호작용 수', value: (reportData.totalClick + reportData.totalTransfer), unit: '회' },
    {
      title: '상호 작용 발생율',
      value: ((reportData.totalClick + reportData.totalTransfer)
                / reportData.totalCPM),
      unit: '%',
      decimalRange: 4
    },
    { title: '리뷰 수(도입예정)', value: '', unit: '회' },
  ]
});

const useStyles = makeStyles(theme => ({
  headline: {
    display: 'flex',
    padding: '24px 32px 0px 32px',
    justifyContent: 'space-between',
    alignItems: 'cetner'
  },
  title: {
    fontWeight: 500
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  contents: {
    padding: '24px 32px'
  }
}));

export default function CampaignOnlyClickAd(props) {
  const classes = useStyles();
  const {
    selectedCampaign, reportData, valueChartData,
    ipToGeoData, clickData
  } = props;

  return (
    <div>
      {!reportData.loading && reportData.payload
      && !valueChartData.loading && valueChartData.payload
      && !ipToGeoData.loading && clickData.loading && (
      <Grid container>
        {/* 헤드라인 */}
        <Grid item xs={12}>
          <div className={classes.headline}>

            {/* 제목 */}
            <Typography variant="h5" className={classes.title}>
              {reportData.payload.campaignName}
                &emsp;광고 효과 분석
            </Typography>

          </div>
          <Divider />
        </Grid>

        {/* 컨텐츠 */}
        <Grid item xs={12}>
          {!reportData.loading && reportData.payload && (
          <div className={classes.contents}>
            <Grid container>

              {/* 캠페인 정보 */}
              <Grid item xs={12}>
                <CampaignInfo selectedCampaign={selectedCampaign} />
              </Grid>

              {/* 개요 및 전체적 정보 */}
              <Grid item xs={12}>

                {/* 개요 */}
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <ContentCard
                      title="광고 비용"
                      color="primary"
                      contents={makeContents(reportData.payload).price}
                      IconComponent={Assignment}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <ContentCard
                      title="광고 효과"
                      color="secondary"
                      contents={makeContents(reportData.payload).effect}
                      IconComponent={Assignment}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <ReportCard
                  data={makeContents(reportData.payload).metrics}
                />
              </Grid>

              {/* 캠페인 지표 차트 */}
              <Grid item xs={12}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <InteractionHeatmap
                      clickData={clickData.payload}
                    />

                    <InteractionToGeo
                      ipToGeoData={ipToGeoData}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
          )}
        </Grid>

      </Grid>
      )}
    </div>
  );
}
