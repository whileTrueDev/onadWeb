import React from 'react';
import Typography from '@material-ui/core/Typography';
import StackedBar from '../../../components/Chart/StackedBar';
import CircularProgress from '../../../components/Progress/CircularProgress';
import useFetchData from '../../../lib/hooks/useFetchData';

function ValueChart() {
  const valueChartData = useFetchData('/api/dashboard/marketer/campaign/chart');

  return (
    <div>
      { valueChartData.loading && (<CircularProgress />)}
      { !valueChartData.loading && valueChartData.error && (
      <Typography variant="h6">데이터가 없어요! 광고를 진행하세요.</Typography>
      )}
      { !valueChartData.loading && valueChartData.payload && (
        <div>
          <StackedBar

            // labels={valueChartData.payload.labels}
            dataSet={valueChartData.payload}
          />
        </div>
      )}
    </div>
  );
}

export default ValueChart;
