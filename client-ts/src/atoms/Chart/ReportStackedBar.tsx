import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Bar, ChartComponentProps } from 'react-chartjs-2';

interface DefaultDataType {
  date: string;
  cash: number;
  type: 'CPC' | 'CPM';
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
  const theme = useTheme();

  // 차트 데이터
  function setStackedBarData<T extends DefaultDataType>(
    data: Array<T>, defaultLabelArray: string[]
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
          label: defaultLabelArray[0],
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          borderWidth: 1,
          hoverBackgroundColor: theme.palette.primary.light,
          hoverBorderColor: theme.palette.primary.light,
          data: CPM
        },
        {
          stack: '1',
          label: defaultLabelArray[1],
          backgroundColor: theme.palette.secondary.main,
          borderColor: theme.palette.secondary.main,
          borderWidth: 1,
          hoverBackgroundColor: theme.palette.secondary.light,
          hoverBorderColor: theme.palette.secondary.light,
          data: CPC
        },
      ],
    };
    return ChartjsBarData;
  }
  const preprocessedDataSet = setStackedBarData<DataType>(dataSet, labelArray);

  return (
    <Bar
      data={preprocessedDataSet}
      options={{
        tooltips: { mode: 'index', intersect: false }, responsive: false, aspectRatio: 2, maintainAspectRatio: false
      }}
      height={height}
      {...rest}
    />
  );
}

ReportStackedBar.defaultProps = {
  labelArray: ['CPM', 'CPC'],
  dateRange: 30
};
