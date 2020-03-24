import React from 'react';
import { Bar, ChartComponentProps } from 'react-chartjs-2';
// 차트 컬러 테마
import { chartTheme2 } from './chartTheme';


interface DefaultDataType {
  date: string;
  cash: number;
  type: 'CPC' | 'CPM';
}
// 차트 데이터
function setStackedBarData<T extends DefaultDataType>(
  data: Array<T>, labelArray: string[]
): any {
  const labels = Array<string>();
  const CPM = Array<number>();
  const CPC = Array<number>();
  data.map((d) => {
    const date = new Date(d.date);
    const label = `${date.getMonth() + 1}. ${date.getDate()}.`;
    if (!labels.includes(label)) { labels.push(label); }
    if (d.type === 'CPM') {
      CPM.push(d.cash);
    } else if (d.type === 'CPC') {
      CPC.push(d.cash);
    }
    return d;
  });

  const ChartjsBarData = {
    labels,
    datasets: [
      {
        stack: '1',
        label: labelArray[0],
        borderWidth: 1,
        data: CPM
      },
      {
        stack: '1',
        label: labelArray[1],
        backgroundColor: chartTheme2.main,
        borderColor: chartTheme2.main,
        borderWidth: 1,
        hoverBackgroundColor: chartTheme2.hover,
        hoverBorderColor: chartTheme2.hover,
        data: CPC
      },
    ],
  };
  return ChartjsBarData;
}

interface ReportStackedBarProps<T> extends Omit<ChartComponentProps, 'type' | 'data'> {
  dataSet: T[];
  labelArray: string[];
}

export default function ReportStackedBar<DataType extends DefaultDataType>({
  height = 70,
  dataSet,
  labelArray,
  ...rest
}: ReportStackedBarProps<DataType>): JSX.Element {
  const preprocessedDataSet = setStackedBarData<DataType>(dataSet, labelArray);

  return (
    <Bar
      data={preprocessedDataSet}
      options={{ tooltips: { mode: 'index', intersect: false }, responsive: false, aspectRatio: 2 }}
      height={height}
      {...rest}
    />
  );
}

ReportStackedBar.defaultProps = {
  labelArray: ['배너광고', '클릭광고'],
  dateRange: 30
};
