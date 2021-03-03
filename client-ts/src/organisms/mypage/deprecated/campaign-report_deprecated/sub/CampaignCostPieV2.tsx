import React from 'react';
import { Pie } from 'react-chartjs-2';
import useTheme from '@material-ui/core/styles/useTheme';
import DonutSmall from '@material-ui/icons/DonutSmall';
import CardTemplate from './CardTemplate';
import { ReportInterfaceV2 } from '../../../marketer/dashboard/interfaces';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';

interface CampaignCostPieProps {
  color: string;
  reportData: UseGetRequestObject<ReportInterfaceV2>;
  [key: string]: any;
}

export default function CampaignCostPie(props: CampaignCostPieProps): JSX.Element {
  const theme = useTheme();
  const { color, reportData, ...rest } = props;

  return (
    <div {...rest}>
      <CardTemplate title="광고 비용 비율" color={color} IconComponent={DonutSmall}>
        <div style={{ justifyContent: 'center', display: 'flex' }}>
          {!reportData.loading && reportData.data && (
          <Pie
            height={250}
            data={{
              labels: ['CPM', 'CPC'],
              datasets: [{
                data: [reportData.data.totalCPM, reportData.data.totalCPC],
                backgroundColor: [theme.palette.primary.light, theme.palette.secondary.light]
              }]
            }}
            options={{ maintainAspectRatio: false }}
          />
          )}
        </div>
      </CardTemplate>
    </div>
  );
}
