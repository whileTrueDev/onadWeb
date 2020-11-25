import moment from 'moment';
import { Paper, Typography } from '@material-ui/core';
import React from 'react';
import { Cell, Pie, PieChart } from 'recharts';

export default function AnotherCard2(): JSX.Element {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const data01 = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 }
  ];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index,
  }: any) => {
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
      <div style={{ display: 'flex', }}>
        <div>
          <Typography style={{ fontWeight: 'bold' }}>광고 수익 정보</Typography>
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

        <div style={{ marginLeft: 16 }}>
          <Typography style={{ fontWeight: 'bold', marginBottom: 16 }}>최근 광고 클릭</Typography>

          <Typography variant="body2">동안미비누 - asdfasdf - from http://localhost:3301/asdfasdf/asdfasdf</Typography>
          <Typography variant="body2">{`인제떡방 ${moment(new Date()).format('YYYY년 MM월 DD일 HH시 mm분')}`}</Typography>
          <Typography variant="body2">동안미비누 - asdfasdf - from http://localhost:3301/asdfasdf/asdfasdf</Typography>
          <Typography variant="body2">동안미비누 - asdfasdf - from http://localhost:3301/asdfasdf/asdfasdf</Typography>
          <Typography variant="body2">모지랑이</Typography>
          <Typography variant="body2">모지랑이</Typography>
          <Typography variant="body2">{`인제떡방 ${moment(new Date()).format('YYYY년 MM월 DD일 HH시 mm분')}`}</Typography>
        </div>
      </div>
    </Paper>
  );
}
