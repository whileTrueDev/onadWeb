import React from 'react';
import Flag from '@material-ui/icons/Flag';
import CardTemplate from './CardTemplate';
import ClickHeatmap from '../../../../../atoms/Chart/heatmap/ClickHeatmap';
import { HeatmapInterface } from '../../../marketer/dashboard/interfaces';

interface HeatmapReportProps {
  clickData?: HeatmapInterface[];
}

export default function HeatmapReport(props: HeatmapReportProps): JSX.Element {
  const { clickData, ...rest } = props;
  return (
    <div {...rest}>
      <CardTemplate title="날짜별 유입 수" IconComponent={Flag} color="secondary">
        {clickData && <ClickHeatmap data={clickData} />}
      </CardTemplate>
    </div>
  );
}
