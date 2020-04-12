import React from 'react';
import Flag from '@material-ui/icons/Flag';
import CardTemplate from './CardTemplate';
import ClickHeatmap from '../../../../../atoms/Chart/heatmap/ClickHeatmap';
import { HeatmapInterface } from '../../dashboard/interfaces';

interface HeatmapReportProps {
  clickData: HeatmapInterface[] | null;
}

export default function HeatmapReport(props: HeatmapReportProps): JSX.Element {
  const { clickData, ...rest } = props;
  return (
    <div {...rest}>
      <CardTemplate title="날짜별 상호작용" IconComponent={Flag} color="secondary">
        {clickData
          && (
            <ClickHeatmap
              data={clickData}
            />
          )}
      </CardTemplate>
    </div>
  );
}
