import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTheme } from '@material-ui/core/styles';

interface ReChartBarProps<T> {
  data: Readonly<T>[];
  legend?: boolean;
  containerHeight?: number;
  chartHeight?: number;
  chartWidth?: number;
  xAxisDataKey?: string;
  yAxisDataKey?: string;
  tooltipFormatter?: (
    value: string | number | Array<string | number>,
    name: string,
  ) => React.ReactNode;
  tooltipLabelFormatter?: (label: string | number) => React.ReactNode;
  // legendFormatter?: (value: string | number | Array<string | number>) => string;
  nopreprocessing?: boolean;
  dataKey?: string;
}

export default function ReChartBar<DataType>({
  data,
  legend,
  dataKey,
  containerHeight = 400,
  chartHeight = 300,
  chartWidth = 500,
  xAxisDataKey,
  yAxisDataKey,
  tooltipLabelFormatter = (label: string | number): string | number => label,
  tooltipFormatter = (value: string | number | Array<string | number>, name: string) => [
    value,
    name,
  ],
  // legendFormatter = (value: string | number | Array<string | number>): string => {
  //   if (value === 'cpm_amount') { return '배너광고'; } return '클릭광고';
  // },
  nopreprocessing = false,
}: ReChartBarProps<DataType>): JSX.Element {
  const theme = useTheme();

  return (
    <div style={{ height: containerHeight, width: '99%' }}>
      <BarChart
        width={chartWidth}
        height={chartHeight}
        data={data}
        stackOffset="sign"
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisDataKey} />
        <YAxis dataKey={yAxisDataKey} />
        <Tooltip
          contentStyle={{ backgroundColor: theme.palette.background.paper }}
          cursor={{ stroke: theme.palette.primary.main, strokeWidth: 1 }}
          labelFormatter={tooltipLabelFormatter}
          formatter={tooltipFormatter}
        />
        {legend && <Legend iconType="circle" />}
        {dataKey && <Bar dataKey={dataKey} stackId="a" fill={theme.palette.primary.light} />}
      </BarChart>
    </div>
  );
}
