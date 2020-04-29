import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Paper, Grid, Divider, Typography,
  Tabs, Tab
} from '@material-ui/core';
import { Assignment } from '@material-ui/icons';
import {
  ReportInterfaceV2, CreatorDataInterface, HeatmapInterface, GeoInterface, CampaignInterface
} from '../dashboard/interfaces';
import { UseGetRequestObject } from '../../../../utils/hooks/useGetRequest';

// own components
import CampaignCostPie from './sub/CampaignCostPieV2';
import CampaignCostBar from './sub/CampaignCostBar';
import BannerBroadCreators from './sub/BannerBroadCreators';
import InteractionHeatmap from './sub/HeatmapReport';
import InteractionToGeo from './sub/GeoReport';
import CampaignInfo from './sub/CampaignInfo';
import CardTemplate from './sub/CardTemplate';
import MetricsExpression from './sub/MetricsExpression';

const useStyles = makeStyles((theme: Theme) => ({
  headline: {
    display: 'flex',
    padding: '24px 32px 0px 32px',
    justifyContent: 'space-between',
    alignItems: 'cetner'
  },
  title: { fontWeight: 500 },
  formControl: { margin: theme.spacing(1), minWidth: 120, },
  contents: { padding: '24px 32px' },
}));

interface CampaignBannerClickAdProps {
  selectedCampaign: CampaignInterface;
  reportData: UseGetRequestObject<null | ReportInterfaceV2>;
  chartData: UseGetRequestObject<any[]>;
  creatorsData: UseGetRequestObject<null | CreatorDataInterface[]>;
  ipToGeoData: UseGetRequestObject<null | GeoInterface[]>;
  clickData: UseGetRequestObject<null | HeatmapInterface[]>;
}

export default function CampaignBannerClickAd(
  props: CampaignBannerClickAdProps
): JSX.Element {
  const classes = useStyles();
  const {
    selectedCampaign, reportData, chartData,
    creatorsData, ipToGeoData, clickData
  } = props;

  const [tabIndex, setTabIndex] = React.useState(0);
  function handleTabChange(e: React.ChangeEvent<{}>, index: number): void {
    setTabIndex(index);
  }

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
                        <Grid item xs={12}>
                          <CardTemplate
                            title="광고 비용"
                            color="primary"
                            IconComponent={Assignment}
                          >
                            <MetricsExpression
                              color="primary"
                              left={{ value: Number(reportData.data.totalCPM) || 0, desc: 'CPM' }}
                              right={{ value: Number(reportData.data.totalCPC) || 0, desc: 'CPC' }}
                              result={{ value: (Number(reportData.data.totalCPC) + Number(reportData.data.totalCPM)) || 0, desc: '총 광고 비용' }}
                            />
                          </CardTemplate>
                        </Grid>
                        <Grid item xs={12}>
                          <CardTemplate
                            title="광고 효과"
                            color="secondary"
                            IconComponent={Assignment}
                            tabs={(
                              <Tabs
                                value={tabIndex}
                                onChange={handleTabChange}
                                indicatorColor="primary"
                                textColor="primary"
                                aria-label="scrollable auto tabs example"
                              >
                                <Tab label="랜딩페이지 이동" />
                                <Tab label="배너 총 노출 " />
                              </Tabs>
                            )}
                          >
                            {tabIndex === 0 && (
                            <MetricsExpression
                              color="secondary"
                              left={{ value: Number(reportData.data.adpanelClick), desc: '패널 유입🖥' }}
                              right={{ value: Number(reportData.data.adchatClick) || 0, desc: '채팅봇 유입🤖' }}
                              result={{
                                value: (Number(reportData.data.adchatClick)
                                + Number(reportData.data.adpanelClick)) || 0,
                                desc: '랜딩페이지 이동 수🏃'
                              }}
                            />
                            )}
                            {tabIndex === 1 && (
                            <MetricsExpression
                              color="secondary"
                              result={{
                                value: (Number(reportData.data.totalViewCount)) || 0,
                                desc: '배너 총 노출 수'
                              }}
                            />
                            )}
                          </CardTemplate>
                        </Grid>
                      </Grid>
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
