import React from 'react';
import Flag from '@material-ui/icons/Flag';
import CardTemplate from './CardTemplate';
import ClickHeatmap from '../../../../atoms/Chart/heatmap/ClickHeatmap';
import { heatmapInterface } from '../dashboard/interfaces';

interface propInterface {
  clickData: heatmapInterface[] | null;
}

export default function HeatmapReport(props: propInterface) {
  const { clickData, ...rest } = props;
  return (
    <div {...rest}>
      <CardTemplate title="날짜별 상호작용" IconComponent={Flag} color="secondary">
        {clickData &&
          (
            <ClickHeatmap
              data={clickData}
            />
          )
        }
      </CardTemplate>
    </div>
  );
}
