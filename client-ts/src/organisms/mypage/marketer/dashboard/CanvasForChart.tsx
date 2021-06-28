/* eslint-disable @typescript-eslint/camelcase */
import { Divider, makeStyles, Paper } from '@material-ui/core';
import 'chartjs-plugin-colorschemes';
import * as React from 'react';
import ReChartBar from '../../../../atoms/Chart/ReChartBar';
import CircularProgress from '../../../../atoms/Progress/CircularProgress';
import { UseGetRequestObject } from '../../../../utils/hooks/useGetRequest';
import ChartTabs from '../campaign-chart/ChartTabs';
import CreatorsChart from '../campaign-chart/CreatorsChart';
import { CPSChartInterface, ValueChartInterface } from './interfaces';

const useStyles = makeStyles(theme => ({
  tabs: { display: 'flex', padding: theme.spacing(2, 2, 0, 2) },
  container: { padding: theme.spacing(2) },
}));
interface CanvasForChartProps {
  valueChartData: UseGetRequestObject<ValueChartInterface[]>;
  cpsChartData: UseGetRequestObject<CPSChartInterface[]>;
}

export default function CanvasForChart(props: CanvasForChartProps): JSX.Element {
  const classes = useStyles();
  const { valueChartData, cpsChartData } = props;

  const [tabValue, setTabValue] = React.useState<number>(0);

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
              {valueChartData.loading && <CircularProgress />}
              {!valueChartData.loading && valueChartData.data && (
                <ReChartBar
                  data={valueChartData.data}
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
              {cpsChartData.loading && <CircularProgress />}
              {!cpsChartData.loading && cpsChartData.data && (
                <ReChartBar
                  data={cpsChartData.data}
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
