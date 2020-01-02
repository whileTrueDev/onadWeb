import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@material-ui/lab/Skeleton';
import ReChartPie from '../../../../../../atoms/Chart/ReChartPie';

export default function ContentsPie(props) {
  const { selectedChartData } = props;
  // const data = useFetchData('/api/dashboard/marketer/creatordetail/contents', { creatorId });
  // 마우스오버 핸들러
  const [activeIndex, setActiveIndex] = React.useState(0);
  const onPieEnter = (d, index) => {
    setActiveIndex(index);
  };

  return (
    <div>
      {!selectedChartData && (
        <Skeleton height={250} />
      )}
      {selectedChartData && (
        <ReChartPie
          activeIndex={activeIndex}
          onPieEnter={onPieEnter}
          data={selectedChartData.data}
          height={300}
          nameKey="gameName"
          dataKey="percent"
          underText
        />
      )}
    </div>
  );
}

ContentsPie.propTypes = {
  selectedChartData: PropTypes.object.isRequired
};