import React from 'react';
import Assignment from '@material-ui/icons/Assignment';
import CardTemplate from './CardTemplate';
import ReportStackedBar from '../../../../atoms/Chart/ReportStackedBar';
import { UseGetRequestObject } from '../../../../utils/hooks/useGetRequest';

interface propInterface {
  color: string;
  chartData: UseGetRequestObject<any[]>
}

export default function CampaignCostBar(props: propInterface) {
  const { color, chartData, ...rest } = props;

  return (
    <div {...rest}>
      <CardTemplate title="광고 비용 그래프" color={color} IconComponent={Assignment}>
        {!chartData.loading && chartData.data && (
          <ReportStackedBar
            height={200}
            dataSet={chartData.data[0]}
          />
        )}
      </CardTemplate>
    </div>
  );
}
