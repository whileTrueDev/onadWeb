import * as React from 'react';
// components
import { Paper } from '@material-ui/core';
import ReChartBar from '../../../../atoms/chart/reChartBar';
import { useCreatorIncomeChart } from '../../../../utils/hooks/query/useCreatorIncomeChart';

export interface IncomeChartParams {
  dateRange: string;
}
export interface IncomeChartProps {
  title?: React.ReactNode;
}
function IncomeChart({ title }: IncomeChartProps): JSX.Element {
  const incomeChart = useCreatorIncomeChart();
  return (
    <Paper style={{ padding: 32, height: 400, marginTop: 8 }}>
      {!title ? null : title}
      <ReChartBar
        data={incomeChart.data ? incomeChart.data : []}
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
