import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { useTheme } from '@material-ui/core/styles';
import makeBarChartData, { KeyMap, ChartDataBase } from '../../utils/chart/makeBarChartData';


interface ReChartBarProps {
  data: ChartDataBase[];
  legend?: boolean;
  containerHeight?: number;
  chartHeight?: number;
  chartWidth?: number;
  xAxisDataKey?: string;
  tooltipFormatter?: (value: any, name: any) => React.ReactNode;
  tooltipLabelFormatter?: (label: any) => React.ReactNode;
  legendFormatter?: (value: string) => string;
  nopreprocessing?: boolean;
  dataKey?: string[] | string;
  labels?: any;
  keyMap: KeyMap[];
}

export default function ReChartBar({
  data,
  legend = true,
  dataKey = ['cpm_amount', 'cpc_amount', 'cpa_amount'],
  labels = ['배너광고', '클릭광고', '참여형광고'],
  containerHeight = 400,
  chartHeight = 300,
  chartWidth = 500,
  xAxisDataKey = 'date',
  tooltipLabelFormatter = (label: string | number): string | number => label,
  tooltipFormatter = (value: any, name: any): any => [value, labels[name]],
  legendFormatter = (value: any): any => labels[value],
  nopreprocessing = false,
  keyMap,
}: ReChartBarProps): JSX.Element {
  const theme = useTheme();

  const preprocessed = useMemo(() => {
    if (nopreprocessing) return data;
    const _data = makeBarChartData(data, keyMap);
    return _data;
  }, [data, keyMap, nopreprocessing]);

  return (
    <div style={{ height: containerHeight, width: '99%' }}>
      <ResponsiveContainer>
        <BarChart
          width={chartWidth}
          height={chartHeight}
          data={preprocessed}
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
