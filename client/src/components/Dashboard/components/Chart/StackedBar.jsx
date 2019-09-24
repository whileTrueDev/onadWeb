import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import chartFunctions from './chartFunction';
// import chartTheme from './chartTheme';

// 차트 컬러 테마
const chartTheme2 = {
  main: ['#9DC8C8', '#58C9B9', '#519D9E', '#D1B6E1', '#dcaf87', '#69a7bc', '#61b7bc', '#9aC1C8'],
  hover: ['#9aC8C8', '#51C9B9', '#598D9E', '#D9c6E1', '#d1af87', '#61a7bc', '#69b7bc', '#91C1C8'],
};

// 차트 데이터
function setStackedBarData(data) {
  const { days, CPM, CPC } = chartFunctions.createStackBarDataSet(data);
  const ChartjsLineData = {
    // labels: days,
    labels: days,
    datasets: [
      {
        stack: '1',
        label: 'CPM',
        // backgroundColor: chartTheme.first,
        // borderColor: chartTheme.first,
        borderWidth: 1,
        // hoverBackgroundColor: chartTheme.second,
        // hoverBorderColor: chartTheme.second,
        data: CPM
      },
      {
        stack: '1',
        label: 'CPC',
        backgroundColor: chartTheme2.main,
        borderColor: chartTheme2.main,
        borderWidth: 1,
        hoverBackgroundColor: chartTheme2.hover,
        hoverBorderColor: chartTheme2.hover,
        data: CPC
      },
    ],
  };
  return ChartjsLineData;
}

export default function StackedBar(props) {
  const {
    dataSet, height, ...rest
  } = props;

  return (
    <Bar
      height={height}
      data={setStackedBarData(dataSet)}
      options={{ tooltips: { mode: 'index', intersect: false, responsive: false } }}
      {...rest}
    />
  );
}

StackedBar.propTypes = {
  dataSet: PropTypes.arrayOf(PropTypes.object).isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

StackedBar.defaultProps = {
  height: 70,
};
