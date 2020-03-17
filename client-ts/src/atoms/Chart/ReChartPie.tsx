import React from 'react';
import {
  PieChart, Pie, Sector, Cell,
  ResponsiveContainer, Legend
} from 'recharts';
import COLORS from './chartTheme';

interface RenderActiveShapeProps {
  unit?: string;
  underText?: boolean;
  [key: string]: any;
}
const RenderActiveShape = (underText?: boolean, tooltipLabelText?: string) => ({
  cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
  fill, percent, value, name, unit
}: RenderActiveShapeProps): JSX.Element => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const underTextY = underText ? cy + 130 : cy;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={underTextY} dy={8} textAnchor="middle" fill={fill}>{name}</text>
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
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill={fill}
      >
        {`${value} ${tooltipLabelText || ''}`}

      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill={fill}
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

interface CustomPieChartProps<T> {
  dataKey: string;
  nameKey: string;
  data: T[];
  height: number;
  legend?: boolean;
  activeIndex?: number;
  onPieEnter?: (...args: any[]) => void;
  tooltipLabelText?: string;
  underText?: boolean;
}

export default function CustomPieChart<DataType extends { value: any }>({
  dataKey,
  nameKey,
  legend,
  onPieEnter,
  activeIndex,
  data = [],
  height = 400,
  underText = false,
  tooltipLabelText = '',
}: CustomPieChartProps<DataType>): JSX.Element {
  const [defaultActiveIndex, setActiveIndex] = React.useState(0);
  const defaultOnPieEnter = (e: any, index: number): void => {
    setActiveIndex(index);
  };

  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            activeIndex={activeIndex || defaultActiveIndex}
            onMouseEnter={onPieEnter || defaultOnPieEnter}
            activeShape={RenderActiveShape(underText, tooltipLabelText)}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={100}
            nameKey={nameKey || 'name'}
            dataKey={dataKey || 'value'}
            animationBegin={0}
            animationDuration={1000}
          >
            {data.map<JSX.Element>(
              (entry, index) => (
                <Cell
                  key={entry.value}
                  fill={COLORS.pie[index % COLORS.pie.length]}
                />
              )
            )}
          </Pie>

          {legend ? (<Legend />) : null}

        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
