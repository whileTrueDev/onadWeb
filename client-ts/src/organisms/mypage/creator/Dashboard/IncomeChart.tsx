import React from 'react';
// components
import { Paper } from '@material-ui/core';
import ReChartBar from '../../../../atoms/Chart/ReChartBar';

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
    <Paper style={{ padding: 32, height: 400, marginTop: 8 }}>
      <ReChartBar data={incomeChartData} />
    </Paper>
  );
}

export default IncomeChart;
