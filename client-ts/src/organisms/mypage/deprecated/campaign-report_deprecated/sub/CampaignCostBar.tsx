import Assignment from '@material-ui/icons/Assignment';
import React from 'react';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';
import CardTemplate from './CardTemplate';

interface CampaignCostBarProps {
  color: string;
  chartData: UseGetRequestObject<any[]>;
  [key: string]: any;
}

export default function CampaignCostBar(props: CampaignCostBarProps): JSX.Element {
  const { color, chartData, ...rest } = props;

  return (
    <div {...rest}>
      <CardTemplate title="광고 비용 그래프" color={color} IconComponent={Assignment}>
        <div style={{ justifyContent: 'center', display: 'flex' }}>
          {/* {!chartData.loading && chartData.data && (
            <ReportStackedBar height={250} dataSet={chartData.data[0]} />
          )} */}
        </div>
      </CardTemplate>
    </div>
  );
}
