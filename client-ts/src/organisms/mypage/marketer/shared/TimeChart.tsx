import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import ReChartBar from '../../../../atoms/Chart/ReChartBar';

interface propInterface {
  selectedChartData: {
    data: Readonly<{ sumtime: string, hours: number }>[];
  }
}
export default function TimeChart(props: propInterface) {
  const { selectedChartData } = props;

  return (
    <div>
      {!selectedChartData && (
        <Skeleton height={400} />
      )}
      {/* {selectedChartData && (
        <ReChartBar<{ sumtime: string, hours: number }>
          containerHeight={400} // 차트를 둘러싼 컴포넌트의 높이
          chartWidth={400} // 차트 넓이
          chartHeight={350} // 차트 높이
          data={selectedChartData.data}// hours 기반오름차순 정렬된 데이터셋
          nopreprocessing // 전처리함수 사용하지 않을 때.
          dataKey="sumtime" // 막대로 보여질 데이터의 키값
          xAxisDataKey="hours" // x축 키값
          yAxisDataKey="sumtime" // y축 키값
          tooltipFormatter={value => [value, '비율']} // 툴팁 포맷
          tooltipLabelFormatter={value => [value, ' 시']} // 툴팁 라벨 포맷
          legend={false}
        />
      )} */}
    </div>
  );
}
