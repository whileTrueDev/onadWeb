/* eslint-disable @typescript-eslint/camelcase */
import * as React from 'react';
// components
import { Paper } from '@material-ui/core';
import ReChartBar from '../../../../atoms/Chart/ReChartBar';
import { ChartDataBase } from '../../../../utils/chart/makeBarChartData';

export interface IncomeChartParams {
  dateRange: string;
}
export interface IncomeChartProps {
  incomeChartData: ChartDataBase[];
  title?: React.ReactNode;
}
function IncomeChart({ incomeChartData, title }: IncomeChartProps): JSX.Element {
  return (
    <Paper style={{ padding: 32, height: 400, marginTop: 8 }}>
      {!title ? null : title}
      <ReChartBar
        data={incomeChartData}
        dataKey={['cpm_amount', 'cpc_amount', 'cps_amount']}
        keyMap={[
          { typeName: 'CPC', to: 'cpc_amount' },
          { typeName: 'CPM', to: 'cpm_amount' },
          { typeName: 'CPS', to: 'cps_amount' },
        ]}
        labels={{
          cpc_amount: '클릭광고',
          cpm_amount: '배너광고',
          cps_amount: '판매형광고',
        }}
      />
    </Paper>
  );
}

export default IncomeChart;
