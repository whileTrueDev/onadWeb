import classnames from 'classnames';
import React from 'react';
import {
  IconButton, makeStyles, Typography, useTheme
} from '@material-ui/core';
import { Doughnut } from 'react-chartjs-2';
import { CloseOutlined } from '@material-ui/icons';
import CircularProgress from '../../../../../../atoms/Progress/CircularProgress';
import { useGetRequest } from '../../../../../../utils/hooks';
import {
  CreatorDataInterface, GeoInterface, HeatmapInterface, ReportInterfaceV2
} from '../../../dashboard/interfaces';
import ReportStackedBar from '../../../../../../atoms/Chart/ReportStackedBar';
import ClickHeatmap from '../../../../../../atoms/Chart/heatmap/ClickHeatmap';
import GeoReport from './report/GeoReport';
import CreatorsReport from './report/CreatorsReport';
import { OnadTheme } from '../../../../../../theme';
import CreatorsReportDetail from './report/CreatorsReportDetail';

const useStyles = makeStyles((theme: OnadTheme) => ({
  container: {
    margin: theme.spacing(2, 0)
  },
  title: { marginBottom: theme.spacing(2) },
  bold: { fontWeight: theme.typography.fontWeightBold },
  article: { marginTop: theme.spacing(3) },
  chartContainer: {
    maxWidth: 600,
    display: 'flex',
    overflow: 'auto',
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`
  },
  chart: { width: 300 },
  chartContainerNoFlex: {
    maxWidth: 600,
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`
  },
  flexCenter: { display: 'flex', alignItems: 'center' },
}));

export interface CampaignAnalysisProps {
  campaignId: string;
}
export default function CampaignAnalysis({
  campaignId,
}: CampaignAnalysisProps): JSX.Element {
  const classes = useStyles();
  const theme = useTheme();

  const ipToGeoData = useGetRequest<{ campaignId: string }, GeoInterface[]>(
    '/marketer/geo/campaign', { campaignId }
  );

  const reportData = useGetRequest<{ campaignId: string }, ReportInterfaceV2>(
    '/marketer/campaign/analysis', { campaignId }
  );

  const chartData = useGetRequest<{ campaignId: string }, any[]>(
    '/marketer/campaign/analysis/v1/expenditure', { campaignId }
  );

  const creatorsData = useGetRequest<{ campaignId: string }, CreatorDataInterface[]>(
    '/marketer/campaign/analysis/creator-data', { campaignId }
  );

  const clickData = useGetRequest<{ campaignId: string }, HeatmapInterface[]>(
    '/marketer/campaign/analysis/heatmap', { campaignId }
  );

  /**
   * (첫번쨰 숫자 / (첫번째숫자 + 두번째숫자) * 100).toFixed(1)
   * @param a 첫번째 숫자
   * @param b 두번째 숫자
   */
  function getPercent(a: number, b: number): string {
    const percent = ((a / (a + b)) * 100);
    if (Number.isNaN(percent)) return '0';
    return percent.toFixed(1);
  }

  function transformToNumber(s: any): number {
    const num = Number(s);
    if (Number.isNaN(num)) return 0;
    return num;
  }


  const [selectedCreator, setSelectedCreator] = React.useState<CreatorDataInterface>();
  function handleSelectCreator(creator: CreatorDataInterface): void {
    setSelectedCreator(creator);
  }
  function handleResetSelectedCreator(): void {
    setSelectedCreator(undefined);
  }

  return (
    <div className={classes.container}>
      <Typography
        variant="h6"
        className={classnames(classes.title, classes.bold)}
      >
        캠페인 분석 정보
      </Typography>

      {/* 로딩중 화면 */}
      {(reportData.loading || chartData.loading || ipToGeoData.loading
        || creatorsData.loading || clickData.loading)
        ? (<CircularProgress />)
        : (
          <div>
            {reportData.data && (
              <div>
                <article>
                  {/* 광고 비용 */}
                  <Typography className={classes.bold}>광고 비용</Typography>
                  <Typography variant="h4" className={classes.bold}>
                    {`${(transformToNumber(reportData.data.totalCPC) + transformToNumber(reportData.data.totalCPM)).toLocaleString()}`}
                    <Typography variant="body2" component="span">원</Typography>
                  </Typography>
                  <Typography variant="body2" component="span" color="textSecondary">
                    {`CPM: ${transformToNumber(reportData.data.totalCPM).toLocaleString()}원(${getPercent(transformToNumber(reportData.data.totalCPM), transformToNumber(reportData.data.totalCPC))}%) + CPC: ${transformToNumber(reportData.data.totalCPC).toLocaleString()}원(${getPercent(transformToNumber(reportData.data.totalCPC), transformToNumber(reportData.data.totalCPM))}%)`}
                  </Typography>

                  {/* 일변 광고 비용, 광고 비용 비율 */}
                  {chartData.data && chartData.data.length > 0 && (
                    <article className={classes.chartContainer}>
                      <div>
                        <ReportStackedBar
                          height={250}
                          dataSet={chartData.data[0]}
                        />
                        <Typography align="center" variant="body1">일별 광고 비용</Typography>
                      </div>

                      <div className={classes.chart}>
                        <Doughnut
                          height={250}
                          data={{
                            labels: ['CPM', 'CPC'],
                            datasets: [{
                              borderWidth: 0,
                              data: [reportData.data.totalCPM, reportData.data.totalCPC],
                              backgroundColor: [
                                theme.palette.primary.main, theme.palette.secondary.main
                              ]
                            }]
                          }}
                        />
                        <Typography align="center" variant="body1">광고 비용 비율</Typography>
                      </div>
                    </article>
                  )}
                </article>

                {/* 배너 총 노출 */}
                <article className={classes.article}>
                  <Typography className={classes.bold}>배너 총 노출 수</Typography>
                  <Typography variant="h4" className={classes.bold}>
                    {transformToNumber(reportData.data.totalViewCount).toLocaleString()}
                    <Typography variant="body2" component="span">회</Typography>
                  </Typography>
                </article>

                {/* 랜딩페이지 이동 */}
                <article className={classes.article}>
                  <Typography className={classes.bold}>랜딩페이지 이동 수</Typography>
                  <Typography variant="h4" className={classes.bold}>
                    {(transformToNumber(reportData.data.adpanelClick)
                    + transformToNumber(reportData.data.adchatClick)).toLocaleString()}
                    <Typography variant="body2" component="span">회</Typography>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {`광고패널: ${transformToNumber(reportData.data.adpanelClick).toLocaleString()}회 + 광고채팅: ${transformToNumber(reportData.data.adchatClick).toLocaleString()}회`}
                  </Typography>
                </article>

                {/* 일별 클릭 수 */}
                {clickData.data && (
                <article className={classes.article}>
                  <Typography className={classes.bold}>일별 클릭 수</Typography>
                  <ClickHeatmap data={clickData.data} />
                </article>
                )}

                {/* 지역별 클릭 수 */}
                {ipToGeoData.data && (
                <article>
                  <Typography className={classes.bold}>지역별 클릭 수</Typography>
                  <article className={classes.chartContainer}>
                    <GeoReport
                      data-html2canvas-ignore
                      ipToGeoData={ipToGeoData}
                      style={{ width: '100%' }}
                    />
                  </article>
                </article>
                )}

                {/* 광고 송출 방송인 목록 */}
                {creatorsData.data && (
                  <article className={classes.article}>
                    <Typography className={classes.bold}>광고 송출한 방송인</Typography>
                    <Typography variant="body2" color="textSecondary">방송인 클릭시 방송정보를 볼 수 있습니다.</Typography>
                    <div className={classes.chartContainerNoFlex}>
                      <CreatorsReport
                        creatorsData={creatorsData}
                        onRowClick={handleSelectCreator}
                      />
                    </div>
                  </article>
                )}

                {/* 광고 송출 방송인 목록 중 특정 방송인 정보  */}
                {selectedCreator && (
                  <article className={classes.article}>
                    <div className={classes.flexCenter}>
                      <Typography className={classes.bold}>
                        {`${selectedCreator.creatorTwitchName || selectedCreator.afreecaName} 방송 정보`}
                      </Typography>
                      <IconButton size="small" onClick={handleResetSelectedCreator}>
                        <CloseOutlined />
                      </IconButton>
                    </div>
                    <CreatorsReportDetail selectedCreator={selectedCreator} />
                  </article>
                )}

              </div>
            )}
          </div>
        )}

    </div>
  );
}
