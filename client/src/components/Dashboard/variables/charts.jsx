// 차트 컬러 테마
const chartTheme = {
  first: [
    '#67b7dc', '#6794dc', '#6771dc', '#8067dc', '#a367dc', '#c767dc',
    '#dc67ce', '#dc67ab', '#dc6788', '#dc6967', '#dc8c67', '#dcaf67',
    '#67b7dc', '#6794dc', '#6771dc', '#8067dc', '#a367dc', '#c767dc',
    '#dc67ce', '#dc67ab', '#dc6788', '#dc6967', '#dc8c67', '#dcaf67'],
  second: [
    '#67b7fe', '#6794fc', '#6771fc', '#8067fc', '#a367fc', '#c767fc',
    '#dc67ee', '#dc67cb', '#dc6799', '#dc6987', '#dc8c87', '#dcaf87',
    '#67b7fe', '#6794fc', '#6771fc', '#8067fc', '#a367fc', '#c767fc',
    '#dc67ee', '#dc67cb', '#dc6799', '#dc6987', '#dc8c87', '#dcaf87'],
};

// 차트 데이터
function setChartjsData(labels, data) {
  const ChartjsLineData = {
    labels,
    datasets: [
      {
        label: '수익금',
        fill: false,
        lineTension: 0.2,
        backgroundColor: '',
        borderColor: '#ddd',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: chartTheme.first,
        pointBackgroundColor: chartTheme.first,
        pointBorderWidth: 1,
        pointHoverRadius: 14,
        pointHoverBackgroundColor: chartTheme.second,
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

const chartjsDataLine = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'yellow',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: '#fff',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 5,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40],
    },
  ],
};


export default setChartjsData;
