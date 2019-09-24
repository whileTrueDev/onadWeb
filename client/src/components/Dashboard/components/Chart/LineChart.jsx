import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import chartTheme from './chartTheme';
// 차트 데이터
function setChartjsData(labels, data, label = '수익금') {
  const ChartjsLineData = {
    labels,
    datasets: [
      {
        label,
        fill: false,
        lineTension: 0.1,
        backgroundColor: '',
        borderColor: '#ddd',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: chartTheme.main,
        pointBackgroundColor: chartTheme.main,
        pointBorderWidth: 1,
        pointHoverRadius: 14,
        pointHoverBackgroundColor: chartTheme.hover,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        pointRadius: 8,
        pointHitRadius: 10,
        data,
      },
    ],
  };
  return ChartjsLineData;
}

export default function LineChart(props) {
  const {
    labels, dataSet, height, ...rest
  } = props;

  return (
    <Line
      height={height}
      data={setChartjsData(labels, dataSet, '노출량')}
      options={{ tooltips: { mode: 'index', intersect: false } }}
      {...rest}
    />
  );
}

LineChart.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  dataSet: PropTypes.arrayOf(PropTypes.number).isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

LineChart.defaultProps = {
  height: 70,
};
