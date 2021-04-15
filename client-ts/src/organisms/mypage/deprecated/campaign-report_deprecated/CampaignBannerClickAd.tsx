import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Paper, Grid, Divider, Typography,
} from '@material-ui/core';
import { Assignment } from '@material-ui/icons';
import {
  ReportInterface, CreatorDataInterface, HeatmapInterface, GeoInterface, CampaignInterface
} from '../../marketer/dashboard/interfaces';
import { UseGetRequestObject } from '../../../../utils/hooks/useGetRequest';

// own components
import ContentCard from './sub/ContentCard';
import CampaignCostPie from './sub/CampaignCostPie';
import CampaignCostBar from './sub/CampaignCostBar';
import BannerBroadCreators from './sub/BannerBroadCreators';
import ReportCard from './sub/ReportCard';
import InteractionHeatmap from './sub/HeatmapReport';
import InteractionToGeo from '../../marketer/adManage/campaign/sub/report/GeoReport';
import CampaignInfo from './sub/CampaignInfo';

const makeContents = (reportData: ReportInterface) => ({
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
      title: '배너 총 노출 시간',
      value: Number(reportData.totalTime) || 0,
      unit: '시간'
    },
    {
      title: '배너 총 클릭 수',
      value: Number(reportData.totalClick) || 0,
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
  ]
});

const useStyles = makeStyles((theme: Theme) => ({
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

interface CampaignBannerClickAdProps {
  selectedCampaign: CampaignInterface;
  reportData: UseGetRequestObject<ReportInterface>;
  chartData: UseGetRequestObject<any[]>;
  creatorsData: UseGetRequestObject<CreatorDataInterface[]>;
  ipToGeoData: UseGetRequestObject<GeoInterface[]>;
  clickData: UseGetRequestObject<HeatmapInterface[]>;
}


export default function CampaignBannerClickAd(
  props: CampaignBannerClickAdProps
): JSX.Element {
  const classes = useStyles();
  const {
    selectedCampaign, reportData, chartData,
    creatorsData, ipToGeoData, clickData
  } = props;


  return (
    <Paper>
      {!reportData.loading && reportData.data
        && !chartData.loading && chartData.data
        && !creatorsData.loading && !ipToGeoData.loading
        && !clickData.loading && (
          <Grid container id="report-window">
            {/* 헤드라인 */}
            <Grid item xs={12}>
              <div className={classes.headline}>

                {/* 제목 */}
                <Typography variant="h5" className={classes.title}>
                  {reportData.data.campaignName}
                  &emsp;광고 효과 분석
                </Typography>

                {/* <MakePdfButton /> */}

              </div>
              <Divider />
            </Grid>

            {/* 컨텐츠 */}
            <Grid item xs={12}>
              {!reportData.loading && reportData.data && (
                <div className={classes.contents}>
                  <Grid container spacing={4}>

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
                            contents={makeContents(reportData.data).price}
                            IconComponent={Assignment}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <ContentCard
                            title="광고 효과"
                            color="secondary"
                            contents={makeContents(reportData.data).effect}
                            IconComponent={Assignment}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      {/* 지표 카드 모음 */}
                      <ReportCard
                        data={makeContents(reportData.data).metrics}
                      />
                    </Grid>

                    {/* 캠페인 지표 차트 */}

                    <Grid item xs={12} sm={6}>
                      <CampaignCostBar
                        color="primary"
                        chartData={chartData}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <CampaignCostPie
                        color="primary"
                        reportData={reportData}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <BannerBroadCreators
                        creatorsData={creatorsData}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <InteractionHeatmap
                        data-html2canvas-ignore
                        clickData={clickData.data}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <InteractionToGeo
                        data-html2canvas-ignore
                        ipToGeoData={ipToGeoData}
                      />
                    </Grid>

                  </Grid>
                </div>
              )}
            </Grid>

          </Grid>
      )}
    </Paper>
  );
}
