import React from 'react';
import { Typography } from '@material-ui/core';
// components
import ReChartBar from '../../../../atoms/Chart/ReChartBar';
import StyledItemText from '../../../../atoms/StyledItemText';
import Card from '../../../../atoms/CustomCard';
import CircularProgress from '../../../../atoms/Progress/CircularProgress';
// hooks
import useGetRequest from '../../../../utils/hooks/useGetRequest';

export interface IncomeChartParams {
  dateRange: string;
}

export interface IncomeChartData {
  date: string;
  cash: number;
  type: 'CPM' | 'CPC';
}

export interface IncomeChartProps {
  incomeChartData: IncomeChartData[];
}

function IncomeChart({
  incomeChartData
}: IncomeChartProps): JSX.Element {
  return (
    <Card
      iconComponent={<StyledItemText primary="광고 수익 확인하기" color="white" />}
    >
      <ReChartBar data={incomeChartData} />
    </Card>
  );
}

export default IncomeChart;
