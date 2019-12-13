import React from 'react';
import {
  PieChart, Pie, Sector, Cell, ResponsiveContainer
} from 'recharts';
import COLORS from './chartTheme';

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, percent, value, name, TooltipLabelText
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{name}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} ${TooltipLabelText}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default function CustomPieChart(props) {
  const {
    data, height, dataKey, nameKey, activeIndex, onPieEnter, TooltipLabelText
  } = props;

  const [defaultActiveIndex, setActiveIndex] = React.useState(0);
  const defaultOnPieEnter = (d, index) => {
    setActiveIndex(index);
  };

  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            activeIndex={activeIndex || defaultActiveIndex}
            onMouseEnter={onPieEnter || defaultOnPieEnter}
            activeShape={renderActiveShape
            }
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={100}
            nameKey={nameKey || 'name'}
            dataKey={dataKey || 'value'}
            animationBegin={0}
            animationEnd={1000}
          >
            {data.map(
              (entry, index) => (
                <Cell
                  key={entry}
                  fill={COLORS.pie[index % COLORS.pie.length]}
                  TooltipLabelText={TooltipLabelText || ''}
                />
              )
            )}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
