import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { useTheme } from '@material-ui/core/styles';
import makeBarChartData, { IncomeChartData } from './makeBarChartData';


interface ReChartBarProps<T> {
  data: T[];
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

export default function ReChartBar<DataType extends IncomeChartData>({
  data,
  legend = true,
  dataKey = ['cpm_amount', 'cpc_amount', 'cpa_amount'],
  containerHeight = 400,
  chartHeight = 300,
  chartWidth = 500,
  xAxisDataKey = 'date',
  tooltipLabelFormatter = (label: string | number): string | number => label,
  tooltipFormatter = (value: string | number | Array<string | number>, name: string): any => {
    if (name === 'cpm_amount') {
      return [value, '배너광고'];
    }
    if (name === 'cpc_amount') {
      return [value, '클릭광고'];
    }
    if (name === 'cpa_amount') {
      return [value, '참여형광고'];
    }
  },
  legendFormatter = (value: string | number | Array<string | number>): any => {
    if (value === 'cpm_amount') {
      return '배너광고';
    } if (value === 'cpc_amount') {
      return '클릭광고';
    }
    if (value === 'cpa_amount') {
      return '참여형광고';
    }
  },
  nopreprocessing = false,
}: ReChartBarProps<DataType>): JSX.Element {
  const theme = useTheme();

  return (
    <div style={{ height: containerHeight, width: '99%' }}>
      <ResponsiveContainer>
        <BarChart
          width={chartWidth}
          height={chartHeight}
          data={nopreprocessing ? data : makeBarChartData<DataType>(data)}
          stackOffset="sign"
          margin={{
            right: theme.spacing(3),
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisDataKey} tick={{ fill: theme.palette.text.secondary }} />
          <YAxis tick={{ fill: theme.palette.text.secondary }} />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.palette.common.white,
              color: theme.palette.common.black,
              fontWeight: theme.typography.fontWeightBold
            }}
            cursor={{ stroke: theme.palette.primary.main, strokeWidth: 1 }}
            labelFormatter={tooltipLabelFormatter}
            formatter={tooltipFormatter}
          />
          {legend && (
            <Legend
              iconType="circle"
              wrapperStyle={{
                fontWeight: theme.typography.fontWeightRegular
              }}
              formatter={legendFormatter}
            />
          )}

          <Bar
            dataKey={dataKey instanceof Array ? dataKey[0] : dataKey}
            stackId="a"
            fill={theme.palette.primary.main}
          />
          {dataKey instanceof Array && dataKey.length >= 2 ? (
            <Bar
              dataKey={dataKey[1]}
              stackId="a"
              fill={theme.palette.secondary.main}
            />
          ) : (null)}
          {dataKey instanceof Array && dataKey.length >= 3 ? (
            <Bar
              dataKey={dataKey[2]}
              stackId="a"
              fill={theme.palette.success.main}
            />
          ) : (null)}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
