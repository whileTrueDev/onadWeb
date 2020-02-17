import React from 'react';
import Typography from '@material-ui/core/Typography';
import ReChartBar from '../../../atoms/Chart/ReChartBar';
import StyledItemText from '../../../atoms/StyledItemText';
import Card from '../../../atoms/CustomCard';
import CircularProgress from '../../../atoms/Progress/CircularProgress';
import useFetchData from '../../../utils/lib/hooks/useFetchData';
import useEventTargetValue from '../../../utils/lib/hooks/useEventTargetValue';

function IncomeChart() {
  const selectedDateRange = useEventTargetValue(30);

  const valueChartData = useFetchData('/api/dashboard/creator/chart', {
    dateRange: selectedDateRange.value
  });

  // 잠시 월별 보기 중단
  // const [type, setType] = React.useState('day');
  // const valueChartMonthlyData = useFetchData('/api/dashboard/creator/chart/monthly');

  return (
    <Card
      iconComponent={<StyledItemText primary="광고 수익 확인하기" style={{ color: '#FFF' }} />}
    >
      { valueChartData.loading && (<CircularProgress />)}
      { !valueChartData.loading && valueChartData.error && (
        <Typography variant="h6">데이터가 없어요! 광고를 진행하세요.</Typography>
      )}
      { !valueChartData.loading && valueChartData.payload && (
        <div>
          <ReChartBar data={valueChartData.payload} />
        </div>
      )}
    </Card>
  );
}

export default IncomeChart;
