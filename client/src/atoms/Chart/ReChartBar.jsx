import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import makeBarChartData from './makeBarChartData';
import COLORS from './chartTheme';

export default function ReChartBar(props) {
  const { data } = props;

  return (
    <div style={{ height: 400, width: '99%' }}>
      <ResponsiveContainer>
        <BarChart
          width={500}
          height={300}
          data={makeBarChartData(data)}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis dataKey="cpm_amount" />
          <Tooltip />
          <Legend />
          <Bar dataKey="cpm_amount" stackId="a" fill="#ddd" />
          <Bar dataKey="cpc_amount" stackId="a" fill="#8884d8">
            {data.map(
              (entry, index) => <Cell key={entry} fill={COLORS.pie[index % COLORS.pie.length]} />
            )}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
