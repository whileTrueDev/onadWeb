import React from 'react';
import Flag from '@material-ui/icons/Flag';
import CardTemplate from '../common/CardTemplate';
import ClickHeatmap from '../../../../../../atoms/Chart/ClickHeatmap';

export default function InteractionHeatmap(props) {
  const { clickData } = props;
  return (
    <CardTemplate title="날짜별 상호작용" IconComponent={Flag} color="secondary">
      <ClickHeatmap
        data={clickData}
      />
    </CardTemplate>
  );
}
