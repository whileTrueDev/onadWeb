import React from 'react';
import { Pie, ChartComponentProps } from 'react-chartjs-2';
import chartTheme from './chartTheme';

// Omit<타입T, string|number|symbol>는
// T 타입에서 두번째 타입인자의 이름을 키값으로 하는 값을 제외한 나머지 타입을 반환한다.
interface PieChartProps extends Omit<ChartComponentProps, 'data'> {
  labels: Array<string | string[] | number | number[] | Date | Date[]>;
  data: Array<number | null | undefined>;
}
export default function PieChart(props: PieChartProps): JSX.Element {
  const { labels, data, ...rest } = props;
  return (
    <Pie
      {...rest}
      redraw
      data={{
        labels,
        datasets: [{
          data,
          backgroundColor: chartTheme.pie
        }],
      }}
    />
  );
}
