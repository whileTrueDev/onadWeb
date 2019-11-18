import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';

// 차트 컬러 테마
const chartTheme2 = {
  main: ['#9DC8C8', '#58C9B9', '#519D9E', '#D1B6E1', '#dcaf87',
    '#69a7bc', '#61b7bc', '#9aC1C8', '#9DC8C8', '#58C9B9', '#519D9E',
    '#D1B6E1', '#dcaf87', '#69a7bc', '#61b7bc', '#9aC1C8', '#9DC8C8',
    '#58C9B9', '#519D9E', '#D1B6E1', '#dcaf87', '#69a7bc', '#61b7bc', '#9aC1C8',
    '#58C9B9', '#519D9E', '#D1B6E1', '#dcaf87', '#f3ad3a', '#d3ad3f'],
  hover: ['#9aC8C8', '#51C9B9', '#598D9E', '#D9c6E1', '#d1af87',
    '#61a7bc', '#69b7bc', '#91C1C8', '#9aC8C8', '#51C9B9', '#598D9E',
    '#D9c6E1', '#d1af87', '#61a7bc', '#69b7bc', '#91C1C8', '#9aC8C8',
    '#51C9B9', '#598D9E', '#D9c6E1', '#d1af87', '#61a7bc', '#69b7bc', '#91C1C8',
    '#58C9B9', '#519D9E', '#D1B6E1', '#dcaf87', '#f9af4f', '#d9ad6f'],
};

// 차트 데이터
function setStackedBarData(data, labelArray, dateRange) {
  const labels = []; const CPM = []; const CPC = [];
  data.map((d) => {
    const date = new Date(d.date);
    const label = `${date.getMonth() + 1}. ${date.getDate()}.`;
    if (!labels.includes(label)) {
      labels.push(label);
    }
    if (d.type === 'CPM') {
      CPM.push(d.cash);
    } else {
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

export default function ReportStackedBar(props) {
  const {
    dataSet, labelArray, type, dateRange, ...rest
  } = props;

  const preprocessedDataSet = setStackedBarData(dataSet, labelArray, type, dateRange);

  return (
    <Bar
      data={preprocessedDataSet}
      options={{ tooltips: { mode: 'index', intersect: false, responsive: false }, aspectRatio: 2 }}
      {...rest}
    />
  );
}

ReportStackedBar.propTypes = {
  dataSet: PropTypes.arrayOf(PropTypes.object).isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  labelArray: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.string,
  dateRange: PropTypes.number
};

ReportStackedBar.defaultProps = {
  type: 'day',
  height: 70,
  labelArray: ['CPM', 'CPC'],
  dateRange: 30
};
