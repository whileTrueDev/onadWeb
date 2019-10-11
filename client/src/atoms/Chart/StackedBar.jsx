import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import chartFunctions from './chartFunction';
// import chartTheme from './chartTheme';

// 차트 컬러 테마
const chartTheme2 = {
  main: ['#9DC8C8', '#58C9B9', '#519D9E', '#D1B6E1', '#dcaf87', '#69a7bc', '#61b7bc', '#9aC1C8', '#9DC8C8', '#58C9B9', '#519D9E', '#D1B6E1', '#dcaf87', '#69a7bc', '#61b7bc', '#9aC1C8', '#9DC8C8', '#58C9B9', '#519D9E', '#D1B6E1', '#dcaf87', '#69a7bc', '#61b7bc', '#9aC1C8'],
  hover: ['#9aC8C8', '#51C9B9', '#598D9E', '#D9c6E1', '#d1af87', '#61a7bc', '#69b7bc', '#91C1C8', '#9aC8C8', '#51C9B9', '#598D9E', '#D9c6E1', '#d1af87', '#61a7bc', '#69b7bc', '#91C1C8', '#9aC8C8', '#51C9B9', '#598D9E', '#D9c6E1', '#d1af87', '#61a7bc', '#69b7bc', '#91C1C8'],
};

// 차트 데이터
function setStackedBarData(
  data, labelArray, type = 'day', dateRange
) {
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

export default function StackedBar(props) {
  const {
    dataSet, labelArray, type, dateRange, ...rest
  } = props;

  return (
    <Bar
      data={setStackedBarData(dataSet, labelArray, type, dateRange)}
      options={{ tooltips: { mode: 'index', intersect: false, responsive: false }, aspectRatio: 2 }}
      {...rest}
    />
  );
}

StackedBar.propTypes = {
  dataSet: PropTypes.arrayOf(PropTypes.object).isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  labelArray: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.string,
  dateRange: PropTypes.number
};

StackedBar.defaultProps = {
  type: 'day',
  height: 70,
  labelArray: ['CPM', 'CPC'],
  dateRange: 30
};
