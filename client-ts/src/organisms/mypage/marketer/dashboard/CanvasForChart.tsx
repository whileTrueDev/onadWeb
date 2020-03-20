import React from 'react';
import 'chartjs-plugin-colorschemes';
import { Paper, Divider } from '@material-ui/core';
import ChartTabs from '../campaign-chart/ChartTabs';
import CreatorsChart from '../campaign-chart/CreatorsChart';
import ReChartBar from '../../../../atoms/Chart/ReChartBar';
import { ValueChartInterface } from './interfaces';
import { UseGetRequestObject } from '../../../../utils/hooks/useGetRequest';

interface CanvasForChartProps {
  valueChartData: UseGetRequestObject<ValueChartInterface[] | null>;
  broadCreatorData: UseGetRequestObject<null | string[]>;
}

export default function CanvasForChart(props: CanvasForChartProps): JSX.Element {
  const { valueChartData, broadCreatorData } = props;

  const [tabValue, setTabValue] = React.useState<number>(0);

  function handleTabChange(event: React.ChangeEvent<{}>, newValue: number): void {
    setTabValue(newValue);
  }

  return (
    <Paper>

      <div>
        <div style={{ display: 'flex', padding: '16px 16px 0px 16px' }}>
          <ChartTabs value={tabValue} handleChange={handleTabChange} />
        </div>
        <Divider />

        <div style={{ padding: 16 }}>
          {tabValue === 0 && valueChartData.data && (
            <ReChartBar data={valueChartData.data} />
          )}
          {tabValue === 1
            && ((!broadCreatorData.loading) && broadCreatorData.data
              && (
                <CreatorsChart broadCreatorData={broadCreatorData} />
              )
            )}
        </div>

      </div>
    </Paper>
  );
}