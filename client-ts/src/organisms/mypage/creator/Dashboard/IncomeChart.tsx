import React from 'react';
import { Typography } from '@material-ui/core';
// components
import ReChartBar from '../../../../atoms/Chart/ReChartBar';
import StyledItemText from '../../../../atoms/StyledItemText';
import Card from '../../../../atoms/CustomCard';
import CircularProgress from '../../../../atoms/Progress/CircularProgress';
// hooks
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import useEventTargetValue from '../../../../utils/hooks/useEventTargetValue';

interface IncomeChartParams {
  dateRange: string;
}

interface IncomeChartData {
  date: string;
  cash: number;
  type: 'CPM' | 'CPC';
}

function IncomeChart(): JSX.Element {
  const selectedDateRange = useEventTargetValue('30');

  const incomeChartGet = useGetRequest<IncomeChartParams, IncomeChartData[]>(
    '/creator/income/chart', {
      dateRange: selectedDateRange.value
    }
  );

  return (
    <Card
      iconComponent={<StyledItemText primary="광고 수익 확인하기" color="white" />}
    >
      { incomeChartGet.loading && (<CircularProgress />)}
      { !incomeChartGet.loading && incomeChartGet.error && (
        <Typography variant="h6">
          데이터가 없어요! 광고를 진행하세요.
        </Typography>
      )}
      { !incomeChartGet.loading && incomeChartGet.data && (
        <ReChartBar data={incomeChartGet.data} />
      )}
    </Card>
  );
}

export default IncomeChart;
