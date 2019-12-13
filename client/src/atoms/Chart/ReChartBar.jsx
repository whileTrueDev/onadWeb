import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import makeBarChartData from './makeBarChartData';

export default function ReChartBar(props) {
  const { data } = props;
  const chartData = makeBarChartData(data);
  const theme = useTheme();

  return (
    <div style={{ height: 400, width: '99%' }}>
      <ResponsiveContainer>
        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis dataKey="cpm_amount" />
          <Tooltip
            cursor={{ stroke: theme.palette.primary.main, strokeWidth: 1 }}
            formatter={(value, name) => {
              if (name === 'cpm_amount') { return [value, '배너광고']; } return [value, '클릭광고'];
            }}
          />
          <Legend
            iconType="circle"
            formatter={value => (
              <Typography>{value === 'cpm_amount' ? '배너광고' : '클릭광고'}</Typography>)}
          />
          <Bar dataKey="cpm_amount" stackId="a" fill={theme.palette.primary.light} />
          <Bar dataKey="cpc_amount" stackId="a" fill={theme.palette.secondary.light} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
