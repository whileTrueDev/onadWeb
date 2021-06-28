import { useTheme, Theme } from '@material-ui/core/styles';
import { Bar, ChartComponentProps } from 'react-chartjs-2';
import chartFunctions from './chartFunction';
import { chartTheme2 } from './chartTheme';

interface DefaultDataType {
  date: string;
  cash: number;
  type: 'CPC' | 'CPM';
}
// 차트 데이터
const setStackedBarData =
  (theme: Theme) =>
  <T extends DefaultDataType>(
    data: T[],
    labelArray: string[],
    type = 'day',
    dateRange = 30,
  ): any => {
    let setupFunc;
    if (type === 'day') {
      setupFunc = chartFunctions.createStackBarDataSet;
    } else {
      setupFunc = chartFunctions.createStackBarDataSetPerMonth;
    }
    const { labels, CPM, CPC } = setupFunc(data, dateRange);

    const ChartjsBarData = {
      labels,
      datasets: [
        {
          stack: '1',
          label: labelArray[0],
          borderWidth: 1,
          data: CPM,
          backgroundColor: theme.palette.action.disabled,
          hovkerBackgroundColor: theme.palette.action.hover,
        },
        {
          stack: '1',
          label: labelArray[1],
          backgroundColor: chartTheme2.main,
          borderColor: chartTheme2.main,
          borderWidth: 1,
          hoverBackgroundColor: chartTheme2.hover,
          hoverBorderColor: chartTheme2.hover,
          data: CPC,
        },
      ],
    };
    return ChartjsBarData;
  };

interface StackedBarProps<T> extends Omit<ChartComponentProps, 'type' | 'data'> {
  dataSet: T[];
  labelArray?: string[];
  dateRange?: number;
  type?: 'day' | 'month';
}

export default function StackedBar<DataType extends DefaultDataType>({
  dataSet,
  type = 'day',
  height = 70,
  dateRange = 30,
  labelArray = ['배너광고', '클릭광고'],
  ...rest
}: StackedBarProps<DataType>): JSX.Element {
  const theme = useTheme();
  const preprocessedDataSet = setStackedBarData(theme)(dataSet, labelArray, type, dateRange);

  return (
    <Bar
      data={preprocessedDataSet}
      options={{ tooltips: { mode: 'index', intersect: false }, responsive: false, aspectRatio: 2 }}
      height={height}
      {...rest}
    />
  );
}
