import React from 'react';
import Assignment from '@material-ui/icons/Assignment';
import CardTemplate from '../common/CardTemplate';
import ReportStackedBar from '../../../../../../atoms/Chart/ReportStackedBar';

export default function CampaignCostBar(props) {
  const { color, valueChartData } = props;

  return (
    <CardTemplate title="광고 비용 그래프" color={color} IconComponent={Assignment}>
      {!valueChartData.loading && (
        <ReportStackedBar
          height={200}
          dataSet={valueChartData.payload[0]}
        />
      )}
    </CardTemplate>
  );
}
