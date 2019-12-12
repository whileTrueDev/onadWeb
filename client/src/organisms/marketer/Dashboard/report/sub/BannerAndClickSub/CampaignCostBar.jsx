import React from 'react';
import useTheme from '@material-ui/core/styles/useTheme';
import Assignment from '@material-ui/icons/Assignment';
import CardTemplate from '../common/CardTemplate';
import ReportStackedBar from '../../../../../../atoms/Chart/ReportStackedBar';

export default function CampaignCostBar(props) {
  const theme = useTheme();
  const { color, reportData, valueChartData } = props;

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
