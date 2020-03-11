import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { useTheme } from '@material-ui/core/styles';
import makeBarChartData from './makeBarChartData';

interface ReChartBarProps {
  data: any[];
  legend?: boolean;
  containerHeight?: number;
  chartHeight?: number;
  chartWidth?: number;
  xAxisDataKey?: string;
  tooltipFormatter?: (
    value: string | number | Array<string | number>, name: string) => React.ReactNode;
  tooltipLabelFormatter?: (label: string | number) => React.ReactNode;
  legendFormatter?: (value: string | number | Array<string | number>) => string;
  nopreprocessing?: boolean;
  dataKey?: string[] | string;
}

export default function ReChartBar({
  data,
  legend = true,
  dataKey = ['cpm_amount', 'cpc_amount'],
  containerHeight = 400,
  chartHeight = 300,
  chartWidth = 500,
  xAxisDataKey = 'date',
  tooltipLabelFormatter = (label: string|number): string|number => label,
  tooltipFormatter = (value: string | number | Array<string | number>, name: string): any => {
    if (name === 'cpm_amount') { return [value, '배너광고']; } return [value, '클릭광고'];
  },
  legendFormatter = (value: string | number | Array<string | number>): string => {
    if (value === 'cpm_amount') { return '배너광고'; } return '클릭광고';
  },
  nopreprocessing = false,
}: ReChartBarProps): JSX.Element {
  const theme = useTheme();

  return (
    <div style={{ height: containerHeight, width: '99%' }}>
      <ResponsiveContainer>
        <BarChart
          width={chartWidth}
          height={chartHeight}
          data={nopreprocessing ? data : makeBarChartData(data)}
          stackOffset="sign"
          margin={{
            top: 20, right: 30, left: 20, bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisDataKey} />
          <YAxis />
          <Tooltip
            contentStyle={{ backgroundColor: theme.palette.background.paper }}
            cursor={{ stroke: theme.palette.primary.main, strokeWidth: 1 }}
            labelFormatter={tooltipLabelFormatter}
            formatter={tooltipFormatter}
          />
          {legend && (
            <Legend
              iconType="circle"
              formatter={legendFormatter}
            />
          )}

          <Bar
            dataKey={dataKey instanceof Array ? dataKey[0] : dataKey}
            stackId="a"
            fill={theme.palette.primary.light}
          />
          {dataKey instanceof Array ? (
            <Bar
              dataKey={dataKey[1]}
              stackId="a"
              fill={theme.palette.secondary.light}
            />
          ) : (null)}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
