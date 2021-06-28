/* eslint-disable max-len */
import dayjs from 'dayjs';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Bar, ChartComponentProps } from 'react-chartjs-2';

interface DefaultDataType {
  date: string;
  value: number;
  type: 'CPC' | 'CPM';
}
interface ReportStackedBarProps extends Omit<ChartComponentProps, 'type' | 'data'> {
  dataSet: any[];
  labelArray: string[];
}
export default function ReportStackedBar({
  height = 70,
  dataSet,
  labelArray,
  ...rest
}: ReportStackedBarProps): JSX.Element {
  const theme = useTheme();

  // 차트 데이터
  const setStackedBarData = useCallback(
    <T extends DefaultDataType>(data: Array<T>, _labelArray: string[]): any => {
      const labels = Array<string>();
      const array1 = Array<number>();
      const array2 = Array<number>();
      const grouped = _.groupBy(
        data.map(x => ({ ...x, date: dayjs(x.date).format('M.DD') })),
        'date',
      );

      Object.keys(grouped).forEach(date => {
        if (!labels.includes(date)) {
          labels.push(date);
        }

        const types = Array.from(new Set(grouped[date].map(x => x.type)));

        grouped[date].forEach(_row => {
          // 판매/클릭 모두 있는 경우
          if (types.length === _labelArray.length) {
            if (_row.type === _labelArray[0]) {
              array1.push(_row.value);
            }
            if (_row.type === _labelArray[1]) {
              array2.push(_row.value);
            }
          } else {
            if (_row.type === _labelArray[0]) {
              array1.push(_row.value);
              array2.push(0);
            }
            if (_row.type === _labelArray[1]) {
              array1.push(0);
              array2.push(_row.value);
            }
          }
        });
      });

      const ChartjsBarData = {
        labels,
        datasets: [
          {
            stack: '1',
            label: _labelArray[0],
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            borderWidth: 1,
            hoverBackgroundColor: theme.palette.primary.light,
            hoverBorderColor: theme.palette.primary.light,
            data: array1,
          },
          {
            stack: '1',
            label: _labelArray[1],
            backgroundColor: theme.palette.secondary.main,
            borderColor: theme.palette.secondary.main,
            borderWidth: 1,
            hoverBackgroundColor: theme.palette.secondary.light,
            hoverBorderColor: theme.palette.secondary.light,
            data: array2, // 클릭
          },
        ],
      };
      return ChartjsBarData;
    },
    [
      theme.palette.primary.light,
      theme.palette.primary.main,
      theme.palette.secondary.light,
      theme.palette.secondary.main,
    ],
  );

  const preprocessedDataSet = useMemo(
    () => setStackedBarData(dataSet, labelArray),
    [dataSet, labelArray, setStackedBarData],
  );

  return (
    <Bar
      data={preprocessedDataSet}
      options={{
        tooltips: { mode: 'index', intersect: false },
        responsive: false,
        aspectRatio: 2,
        maintainAspectRatio: false,
      }}
      height={height}
      {...rest}
    />
  );
}
