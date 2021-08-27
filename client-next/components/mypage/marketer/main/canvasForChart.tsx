import { Divider, makeStyles, Paper } from '@material-ui/core';
import * as React from 'react';
import ReChartBar from '../../../../atoms/chart/reChartBar';
import CircularProgress from '../../../../atoms/progress/circularProgress';
import { useMarketerAdAnalysisExpenditure } from '../../../../utils/hooks/query/useMarketerAdAnalysisExpenditure';
import { useMarketerAdAnalysisExpenditureCPS } from '../../../../utils/hooks/query/useMarketerAdAnalysisExpenditureCPS';
import ChartTabs from '../campaign-chart/chartTabs';
import CreatorsChart from '../campaign-chart/creatorsChart';

const useStyles = makeStyles(theme => ({
  tabs: { display: 'flex', padding: theme.spacing(2, 2, 0, 2) },
  container: { padding: theme.spacing(2) },
}));

export default function CanvasForChart(): JSX.Element {
  const classes = useStyles();

  const valueChart = useMarketerAdAnalysisExpenditure();
  const cpsChart = useMarketerAdAnalysisExpenditureCPS();

  const [tabValue, setTabValue] = React.useState<number>(0);

  // eslint-disable-next-line @typescript-eslint/ban-types
  function handleTabChange(event: React.ChangeEvent<{}>, newValue: number): void {
    setTabValue(newValue);
  }

  return (
    <Paper>
      <div>
        <div className={classes.tabs}>
          <ChartTabs value={tabValue} handleChange={handleTabChange} />
        </div>
        <Divider />

        <div className={classes.container}>
          {/* 광고비용 */}
          {tabValue === 0 && (
            <div>
              {valueChart.isLoading && <CircularProgress />}
              {!valueChart.isLoading && valueChart.data && (
                <ReChartBar
                  data={valueChart.data || []}
                  dataKey={['cpm_amount', 'cpc_amount']}
                  labels={{
                    cpm_amount: '배너광고',
                    cpc_amount: '클릭광고',
                  }}
                  keyMap={[
                    { typeName: 'CPM', to: 'cpm_amount' },
                    { typeName: 'CPC', to: 'cpc_amount' },
                  ]}
                />
              )}
            </div>
          )}

          {/* 송출 방송인 */}
          {tabValue === 1 && <CreatorsChart />}

          {/* 상품 판매 클릭수 / 판매수 */}
          {tabValue === 2 && (
            <div style={{ width: '100%' }}>
              {cpsChart.isLoading && <CircularProgress />}
              {!cpsChart.isLoading && cpsChart.data && (
                <ReChartBar
                  data={cpsChart.data || []}
                  dataKey={['click_amount', 'sales_amount']}
                  keyMap={[
                    { typeName: '클릭', to: 'click_amount' },
                    { typeName: '판매', to: 'sales_amount' },
                  ]}
                  labels={{
                    click_amount: '클릭수',
                    sales_amount: '판매수',
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Paper>
  );
}
