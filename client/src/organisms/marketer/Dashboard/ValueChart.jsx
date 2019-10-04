import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import Typography from '@material-ui/core/Typography';
import StackedBar from '../../../atoms/Chart/StackedBar';
import CircularProgress from '../../../atoms/Progress/CircularProgress';
import useFetchData from '../../../utils/lib/hooks/useFetchData';

function ValueChart() {
  const valueChartData = useFetchData('/api/dashboard/marketer/campaign/chart');
  const theme = useTheme();
  const isXlWidth = useMediaQuery(theme.breakpoints.up('lg'));
  console.log(isXlWidth);

  return (
    <div>
      { valueChartData.loading && (<CircularProgress />)}
      { !valueChartData.loading && valueChartData.error && (
      <Typography variant="h6">데이터가 없어요! 광고를 진행하세요.</Typography>
      )}
      { !valueChartData.loading && valueChartData.payload && (
        <div>
          {isXlWidth ? (
            <StackedBar height={70} dataSet={valueChartData.payload} />
          ) : (
            <StackedBar height={150} dataSet={valueChartData.payload} />
          )}
        </div>
      )}
    </div>
  );
}

export default ValueChart;
