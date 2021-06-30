import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { nanoid } from 'nanoid';
import COLORS from './chartTheme';

interface RenderActiveShapeProps {
  unit?: string;
  underText?: boolean;
  [key: string]: any;
}

interface CustomPieChartProps<T> {
  dataKey: string;
  nameKey: string;
  data: Readonly<T>[];
  height: number;
  legend?: boolean;
  activeIndex?: number;
  onPieEnter?: (...args: any[]) => void;
  tooltipLabelText?: string;
  underText?: boolean;
}
//  extends { value: any }
export default function CustomPieChart<DataType>({
  dataKey,
  nameKey,
  legend,
  data = [],
  height = 400,
}: CustomPieChartProps<DataType>): JSX.Element {
  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            label
            data={data}
            innerRadius={50}
            outerRadius={80}
            nameKey={nameKey || 'name'}
            dataKey={dataKey || 'value'}
            animationBegin={0}
            animationDuration={1000}
          >
            {data.map<JSX.Element>((entry, index) => (
              <Cell key={nanoid()} fill={COLORS.pie[index % COLORS.pie.length]} />
            ))}
          </Pie>

          <Tooltip />
          {legend ? <Legend /> : null}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
