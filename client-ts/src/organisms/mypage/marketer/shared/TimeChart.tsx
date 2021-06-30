import Skeleton from '@material-ui/lab/Skeleton';
import ReChartBarT from '../../../../atoms/Chart/ReChartBarT';

interface TimeChartProps {
  selectedChartData: {
    data: Readonly<{ sumtime: string; hours: number }>[];
  };
  width?: number;
  containerHeight?: number;
  chartHeight?: number;
}
export default function TimeChart(props: TimeChartProps): JSX.Element {
  const { selectedChartData, width = 295, containerHeight = 400, chartHeight = 350 } = props;

  return (
    <div>
      {!selectedChartData && <Skeleton height={400} />}
      {selectedChartData && (
        <ReChartBarT<{ sumtime: string; hours: number }>
          containerHeight={containerHeight} // 차트를 둘러싼 컴포넌트의 높이
          chartWidth={width} // 차트 넓이
          chartHeight={chartHeight} // 차트 높이
          data={selectedChartData.data} // hours 기반오름차순 정렬된 데이터셋
          nopreprocessing // 전처리함수 사용하지 않을 때.
          dataKey="sumtime" // 막대로 보여질 데이터의 키값
          xAxisDataKey="hours" // x축 키값
          yAxisDataKey="sumtime" // y축 키값
          tooltipFormatter={value => [value, '비율']} // 툴팁 포맷
          tooltipLabelFormatter={value => [value, ' 시']} // 툴팁 라벨 포맷
          legend={false}
        />
      )}
    </div>
  );
}
