import React from 'react';
import 'chartjs-plugin-colorschemes';
import { Paper, Divider } from '@material-ui/core';
import ChartTabs from './ChartTabs';
import CreatorsChart from './CreatorsChart';
import ReChartBar from '../../../../../atoms/Chart/ReChartBar';

export default function CanvasForChart(props) {
  const { creatorsData, valueChartData, broadCreatorData } = props;
  const [tabValue, setTabValue] = React.useState(0);
  function handleTabChange(event, newValue) {
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
          {tabValue === 0 && (
          <ReChartBar data={valueChartData.payload} />
          )}
          {tabValue === 1 && (
            <CreatorsChart creatorsData={creatorsData} broadCreatorData={broadCreatorData} />
          )}
        </div>

      </div>
    </Paper>
  );
}
