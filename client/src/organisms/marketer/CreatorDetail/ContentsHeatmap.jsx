import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import ViewerHeatmap from '../../../atoms/Chart/heatmap/ViewerHeatmap';
import useFetchData from '../../../utils/lib/hooks/useFetchData';
// import './heatmap.css';

export default function ContentsHeatmap(props) {
  const { creatorId } = props;
  // const data = useFetchData('/api/dashboard/marketer/creatordetail/viewerheatmap', { creatorId: '193785576' });

  return (
    <div>
      {data.loading && (
        <Skeleton height={400} />
      )}
      {!data.loading && data.payload && (
        // <ViewerHeatmap data={data.payload.viewerHeatmapData.data} />
        <span>hitmap 아니고 heatmap</span>
      )}
    </div>
  );
}
