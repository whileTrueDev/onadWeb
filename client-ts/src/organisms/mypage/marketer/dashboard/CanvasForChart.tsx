import React from 'react';
import 'chartjs-plugin-colorschemes';
import { Paper, Divider, makeStyles } from '@material-ui/core';
import ChartTabs from '../campaign-chart/ChartTabs';
import CreatorsChart from '../campaign-chart/CreatorsChart';
import ReChartBar from '../../../../atoms/Chart/ReChartBar';
import { ValueChartInterface } from './interfaces';
import { UseGetRequestObject } from '../../../../utils/hooks/useGetRequest';
import CircularProgress from '../../../../atoms/Progress/CircularProgress';

const useStyles = makeStyles((theme) => ({
  tabs: { display: 'flex', padding: theme.spacing(2, 2, 0, 2) },
  container: { padding: theme.spacing(2) },
}));
interface CanvasForChartProps {
  valueChartData: UseGetRequestObject<ValueChartInterface[] | null>;
}

export default function CanvasForChart(props: CanvasForChartProps): JSX.Element {
  const classes = useStyles();
  const { valueChartData } = props;

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
          {tabValue === 0 && (
          <div>
            {valueChartData.loading && (<CircularProgress />)}
            {!valueChartData.loading && valueChartData.data && (
            <ReChartBar
              data={valueChartData.data}
              dataKey={['cpm_amount', 'cpc_amount']}
            />
            )}
          </div>

          )}
          {tabValue === 1 && (<CreatorsChart />)}
        </div>

      </div>
    </Paper>
  );
}
