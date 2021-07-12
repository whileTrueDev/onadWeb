import { IconButton, makeStyles, Typography, useTheme } from '@material-ui/core';
import { CloseOutlined } from '@material-ui/icons';
import classnames from 'classnames';
import { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import ClickHeatmap from '../../../../../../atoms/Chart/heatmap/ClickHeatmap';
import ReportStackedBar from '../../../../../../atoms/Chart/ReportStackedBar';
import CircularProgress from '../../../../../../atoms/Progress/CircularProgress';
import { OnadTheme } from '../../../../../../theme';
import { useMarketerCampaignAnalysisCPS } from '../../../../../../utils/hooks/query/useMarketerCampaignAnalysisCPS';
import { useMarketerCampaignAnalysisCPSChart } from '../../../../../../utils/hooks/query/useMarketerCampaignAnalysisCPSChart';
import { CreatorDataCPSInterface } from '../../../dashboard/interfaces';
import CreatorsReportCPS from './report/CreatorsReportCPS';
import CreatorsReportDetail from './report/CreatorsReportDetail';
import GeoReport from './report/GeoReport';

const useStyles = makeStyles((theme: OnadTheme) => ({
  container: {
    margin: theme.spacing(2, 0),
  },
  title: { marginBottom: theme.spacing(2) },
  bold: { fontWeight: theme.typography.fontWeightBold },
  article: { marginTop: theme.spacing(3) },
  chartContainer: {
    maxWidth: 600,
    display: 'flex',
    overflow: 'auto',
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`,
  },
  chart: { width: 300 },
  chartContainerNoFlex: {
    maxWidth: 600,
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`,
  },
  flexCenter: { display: 'flex', alignItems: 'center' },
}));

export interface CampaignAnalysisCPSProps {
  campaignId: string;
}
export default function CampaignAnalysisCPS({ campaignId }: CampaignAnalysisCPSProps): JSX.Element {
  const classes = useStyles();
  const theme = useTheme();

  const reportData = useMarketerCampaignAnalysisCPS(campaignId);
  const chartData = useMarketerCampaignAnalysisCPSChart(campaignId);

  function transformToNumber(s: any): number {
    const num = Number(s);
    if (Number.isNaN(num)) return 0;
    return num;
  }

  const [selectedCreator, setSelectedCreator] = useState<CreatorDataCPSInterface>();
  function handleSelectCreator(creator: CreatorDataCPSInterface): void {
    setSelectedCreator(creator);
    const panel = document.getElementById('onad-main-panel');
    if (panel) panel.scrollTo(0, panel.scrollHeight);
  }
  function handleResetSelectedCreator(): void {
    setSelectedCreator(undefined);
  }

  return (
    <div className={classes.container}>
      <Typography variant="h6" className={classnames(classes.title, classes.bold)}>
        캠페인 분석 정보
      </Typography>

      {/* 로딩중 화면 */}
      {reportData.isLoading || chartData.isLoading ? (
        <CircularProgress />
      ) : (
        <div>
          {reportData.data && (
            <div>
              <article>
                {/* 광고 비용 */}
                <Typography className={classes.bold}>판매액</Typography>
                <Typography variant="h4" className={classes.bold}>
                  {reportData.data.totalSalesIncome
                    ? reportData.data.totalSalesIncome.toLocaleString()
                    : 0}
                  <Typography variant="body2" component="span">
                    원
                  </Typography>
                </Typography>

                {/* 일변 광고 비용, 광고 비용 비율 */}
                {chartData.data && chartData.data.length > 0 && (
                  <article className={classes.chartContainer}>
                    <div>
                      <ReportStackedBar
                        height={250}
                        dataSet={chartData.data}
                        labelArray={['클릭', '판매']}
                      />
                      <Typography align="center" variant="body1">
                        일별 클릭,판매량
                      </Typography>
                    </div>

                    <div className={classes.chart}>
                      <Doughnut
                        height={250}
                        data={{
                          labels: ['판매수', '클릭수'],
                          datasets: [
                            {
                              borderWidth: 0,
                              data: [
                                reportData.data.totalSalesAmount,
                                reportData.data.adchatClick ||
                                  0 + reportData.data.adpanelClick ||
                                  0,
                              ],
                              backgroundColor: [
                                theme.palette.primary.main,
                                theme.palette.secondary.main,
                              ],
                            },
                          ],
                        }}
                      />
                      <Typography align="center" variant="body1">
                        판매 비율
                      </Typography>
                    </div>
                  </article>
                )}
              </article>

              {/* 상품 판매수 */}
              <article className={classes.article}>
                <Typography className={classes.bold}>상품 판매 수</Typography>
                <Typography variant="h4" className={classes.bold}>
                  {transformToNumber(reportData.data.totalSalesAmount).toLocaleString()}
                  <Typography variant="body2" component="span">
                    개
                  </Typography>
                </Typography>
              </article>

              {/* 배너 총 노출 */}
              <article className={classes.article}>
                <Typography className={classes.bold}>상품 클릭 수</Typography>
                <Typography variant="h4" className={classes.bold}>
                  {(
                    transformToNumber(reportData.data.adpanelClick) +
                    transformToNumber(reportData.data.adchatClick)
                  ).toLocaleString()}
                  <Typography variant="body2" component="span">
                    회
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {`광고패널: ${transformToNumber(
                      reportData.data.adpanelClick,
                    ).toLocaleString()}회 + 광고채팅: ${transformToNumber(
                      reportData.data.adchatClick,
                    ).toLocaleString()}회`}
                  </Typography>
                </Typography>
              </article>

              {/* 일별 클릭 수 */}
              <article className={classes.article}>
                <Typography className={classes.bold}>일별 클릭 수</Typography>
                <ClickHeatmap campaignId={campaignId} />
              </article>

              {/* 지역별 클릭 수 */}
              <article>
                <Typography className={classes.bold}>지역별 클릭 수</Typography>
                <article className={classes.chartContainer}>
                  <GeoReport campaignId={campaignId} style={{ width: '100%' }} />
                </article>
              </article>

              {/* 광고 송출 방송인 목록 */}
              <article className={classes.article}>
                <Typography className={classes.bold}>상품을 판매한 방송인</Typography>
                <Typography variant="body2" color="textSecondary">
                  방송인 클릭시 방송정보를 볼 수 있습니다.
                </Typography>
                <div className={classes.chartContainerNoFlex}>
                  <CreatorsReportCPS campaignId={campaignId} onRowClick={handleSelectCreator} />
                </div>
              </article>

              {/* 광고 송출 방송인 목록 중 특정 방송인 정보  */}
              {selectedCreator && (
                <article className={classes.article}>
                  <div className={classes.flexCenter}>
                    <Typography className={classes.bold}>
                      {`${
                        selectedCreator.creatorTwitchName || selectedCreator.afreecaName
                      } 방송 정보`}
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
