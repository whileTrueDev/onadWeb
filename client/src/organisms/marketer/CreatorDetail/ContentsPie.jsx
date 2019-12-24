import React from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@material-ui/lab/Skeleton';
import ReChartPie from '../../../atoms/Chart/ReChartPie';
import useFetchData from '../../../utils/lib/hooks/useFetchData';

export default function ContentsPie(props) {
  const { creatorId } = props;
  const data = useFetchData('/api/dashboard/marketer/creatordetail/contents', { creatorId });

  // 마우스오버 핸들러
  const [activeIndex, setActiveIndex] = React.useState(0);
  const onPieEnter = (d, index) => {
    setActiveIndex(index);
  };

  return (
    <div>
      {data.loading && (
        <Skeleton height={400} />
      )}
      {!data.loading && data.payload && (
        <ReChartPie
          activeIndex={activeIndex}
          onPieEnter={onPieEnter}
          data={data.payload.contentsGraphData.data}
          height={400}
          nameKey="gameName"
          dataKey="percent"
          underText
        />
      )}
    </div>
  );
}

ContentsPie.propTypes = {
  creatorId: PropTypes.string.isRequired
};
