import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Grid, Divider, Typography,
} from '@material-ui/core';
import { Assignment } from '@material-ui/icons';
// own components
import ContentCard from './common/ContentCard';
import CampaignCostPie from './BannerAndClickSub/CampaignCostPie';
import CampaignCostBar from './BannerAndClickSub/CampaignCostBar';
import BannerBroadCreators from './onlyBannerSub/BannerBroadCreators';
import ReportCard from './common/ReportCard';
import InteractionHeatmap from './onlyClickSub/InteractionHeatmap';
import InteractionToGeo from './onlyClickSub/InteractionToGeo';
import CampaignInfo from './common/CampaignInfo';
import MakePdfButton from './MakePdfButton';

const makeContents = reportData => ({
  price: [
    {
      title: '광고 총 비용',
      value: Number(reportData.totalCPM) + Number(reportData.totalCPC) || 0,
      unit: '원'
    },
    {
      title: '배너광고 총 비용',
      value: Number(reportData.totalCPM) || 0,
      unit: '원'
    },
    {
      title: '클릭광고 총 비용',
      value: Number(reportData.totalCPC) || 0,
      unit: '원'
    }
  ],
  effect: [
    {
      title: '배너 총 노출 수',
      value: Number(reportData.totalViewCount) || 0,
      unit: '회'
    },
    {
      title: '배너 총 클릭 수',
      value: Number(reportData.totalClick) || 0,
      unit: '회'
    },
    {
      title: '홈페이지 이동 수',
      value: Number(reportData.totalTransfer) || 0,
      unit: '회'
    },
  ],
  metrics: [
    {
      title: '전환당 비용',
      value: ((reportData.totalCPM + reportData.totalCPC) / reportData.totalTransfer) || 0,
      unit: '원',
      decimalRange: 2
    },
    {
      title: '전환율',
      value: (reportData.totalTransfer / reportData.totalLandingView) || 0,
      unit: '%',
      decimalRange: 4
    },
    {
      title: '상호작용 수',
      value: (reportData.totalClick + reportData.totalTransfer) || 0,
      unit: '회'
    },
    {
      title: '상호 작용 발생율',
      value: ((reportData.totalClick + reportData.totalTransfer)
                / reportData.totalViewCount) || 0,
      unit: '%',
      decimalRange: 4
    },
    {
      title: '배너조회율',
      value: (reportData.totalClick / reportData.totalViewCount) || 0,
      unit: '',
      decimalRange: 4
    },
    {
      title: '배너클릭율',
      value: (reportData.totalTransfer / reportData.totalViewCount) || 0,
      unit: '',
      decimalRange: 4
    },
    { title: '지표 준비중', value: '', unit: '' },
    { title: '지표 준비중.', value: '', unit: '' },
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
  },
}));

export default function CampaignBannerClickAd(props) {
  const classes = useStyles();
  const {
    selectedCampaign, reportData, valueChartData,
    creatorsData, ipToGeoData, clickData
  } = props;


  return (
    <div style={{ backgroundColor: '#fff' }}>
      {!reportData.loading && reportData.payload
      && !valueChartData.loading && valueChartData.payload
      && !creatorsData.loading && !ipToGeoData.loading
      && !clickData.loading && (
      <Grid container id="report-window">
        {/* 헤드라인 */}
        <Grid item xs={12}>
          <div className={classes.headline}>

            {/* 제목 */}
            <Typography variant="h5" className={classes.title}>
              {reportData.payload.campaignName}
                &emsp;광고 효과 분석
            </Typography>

            <MakePdfButton />

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
                {/* 지표 카드 모음 */}
                <ReportCard
                  data={makeContents(reportData.payload).metrics}
                />
              </Grid>

              {/* 캠페인 지표 차트 */}
              <Grid item xs={12}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <CampaignCostBar
                      color="primary"
                      valueChartData={valueChartData}
                    />

                    <CampaignCostPie
                      color="primary"
                      reportData={reportData.payload}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <BannerBroadCreators
                      creatorsData={creatorsData}
                    />

                    <InteractionHeatmap
                      data-html2canvas-ignore
                      clickData={clickData.payload}
                    />

                    <InteractionToGeo
                      data-html2canvas-ignore
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
