import React from 'react';
import 'chartjs-plugin-colorschemes';
import { Paper, Divider } from '@material-ui/core';
import ChartTabs from './chart/ChartTabs';
import CreatorsChart from './chart/CreatorsChart';
import ReChartBar from '../../../atoms/Chart/ReChartBar';


export default function CanvasForChart(props) {
  const { valueChartData, broadCreatorData } = props;

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
            (!broadCreatorData.loading && broadCreatorData.payload)
              && (
                <CreatorsChart broadCreatorData={broadCreatorData} />
              )
          )}
        </div>

      </div>
    </Paper>
  );
}
