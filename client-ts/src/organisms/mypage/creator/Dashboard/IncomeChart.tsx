import React from 'react';
// components
import ReChartBar from '../../../../atoms/Chart/ReChartBar';
import StyledItemText from '../../../../atoms/StyledItemText';
import Card from '../../../../atoms/CustomCard';

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
