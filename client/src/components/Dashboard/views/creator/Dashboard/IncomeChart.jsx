import React from 'react';
import Typography from '@material-ui/core/Typography';
import StackedBar from '../../../components/Chart/StackedBar';
import CircularProgress from '../../../components/Progress/CircularProgress';
import Button from '../../../components/CustomButtons/Button';
import useFetchData from '../../../lib/hooks/useFetchData';
import useEventTargetValue from '../../../lib/hooks/useEventTargetValue';

function IncomeChart() {
  const [type, setType] = React.useState('day');
  const selectedDateRange = useEventTargetValue(30);

  const valueChartData = useFetchData('/api/dashboard/creator/chart', {
    dateRange: selectedDateRange.value
  });

  const valueChartMonthlyData = useFetchData('/api/dashboard/creator/chart/monthly');

  return (
    <div>
      { valueChartData.loading && (<CircularProgress />)}
      { !valueChartData.loading && valueChartData.error && (
      <Typography variant="h6">데이터가 없어요! 광고를 진행하세요.</Typography>
      )}
      { !valueChartData.loading && valueChartData.payload && (
        <div>
          {type === 'day' ? (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div />

              <Button color="info" onClick={() => { setType('month'); }}>
              월별로 보기
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div />

              <Button color="warning" onClick={() => { setType('day'); }}>
              일별로 보기
              </Button>
            </div>
          )}

          {type === 'day' ? (
            <StackedBar
              height={140}
              dataSet={valueChartData.payload}
              labelArray={['배너수익', '광고페이지수익']}
              type="day"
              dateRange={selectedDateRange.value}
            />
          ) : (
            <div>
              {!valueChartMonthlyData.loading && valueChartMonthlyData.payload && (
              <StackedBar
                height={140}
                dataSet={valueChartMonthlyData.payload}
                labelArray={['배너수익', '광고페이지수익']}
                type="month"
              />
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default IncomeChart;
