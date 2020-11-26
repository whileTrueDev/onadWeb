import { Paper, Typography } from '@material-ui/core';
import React from 'react';
import { Cell, Pie, PieChart } from 'recharts';

export default function AdIncomeCard(): JSX.Element {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const data01 = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 }
  ];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index,
  }: any): JSX.Element => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  return (
    <Paper style={{
      height: 200, padding: 32, marginBottom: 16,
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <div>
          <Typography>배너광고수익</Typography>
          <Typography variant="h4" style={{ fontWeight: 'bold' }}>2000만원</Typography>
          <Typography>클릭광고수익</Typography>
          <Typography variant="h4" style={{ fontWeight: 'bold' }}>1500만원</Typography>
          <Typography>채팅광고수익</Typography>
          <Typography variant="h4" style={{ fontWeight: 'bold' }}>1800만원</Typography>
        </div>
        <div>
          <Typography style={{ fontWeight: 'bold' }}>광고 수익 비율</Typography>
          <PieChart width={180} height={180}>
            <Pie
              data={data01}
              dataKey="value"
              cx={90}
              cy={90}
              outerRadius={70}
              fill="#8884d8"
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {data01.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
          </PieChart>
        </div>

      </div>


    </Paper>
  );
}
