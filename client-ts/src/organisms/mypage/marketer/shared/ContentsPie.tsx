import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import ReChartPie from '../../../../atoms/Chart/ReChartPie';

interface propInterface {
  selectedChartData: {
    data: Readonly<{ gameName: string, percent: number }>[];
  }
}

export default function ContentsPie(props: propInterface) {
  const {
    selectedChartData
  } = props;
  // 마우스오버 핸들러
  const [activeIndex, setActiveIndex] = React.useState(0);

  const onPieEnter = (d: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <div>
      {!selectedChartData && (
        <Skeleton height={400} />
      )}
      {selectedChartData && (
        <ReChartPie< { gameName: string, percent: number }>
          activeIndex={activeIndex}
          onPieEnter={onPieEnter}
          data={selectedChartData.data}
          height={400}
          nameKey="gameName"
          dataKey="percent"
          underText
          legend
        />
      )}
    </div>
  );
}
