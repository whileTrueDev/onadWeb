import React from 'react';
import 'chartjs-plugin-colorschemes';
import { Bar } from 'react-chartjs-2';
import { Paper, Divider, useMediaQuery } from '@material-ui/core';
import Pie from '../../../../../atoms/Chart/PieChart';
import StackedBar from '../../../../../atoms/Chart/StackedBar';
import ChartTabs from './ChartTabs';

export default function CanvasForChart(props) {
  const { creatorsData, valueChartData } = props;
  const [tabValue, setTabValue] = React.useState(0);
  function handleTabChange(event, newValue) {
    setTabValue(newValue);
  }
  const isLgWidth = useMediaQuery('(min-width:1280px)');

  return (
    <Paper style={{ maxHeight: 600 }}>

      <div>
        <div style={{ display: 'flex', padding: '16px 16px 0px 16px' }}>
          <ChartTabs value={tabValue} handleChange={handleTabChange} />
        </div>
        <Divider />

        <div style={{ padding: 16 }}>
          {tabValue === 0 && (
            <StackedBar
              height={isLgWidth ? '100%' : 300}
              dataSet={valueChartData.payload}
            />
          )}

          {tabValue === 1 && (
            <div>
              {creatorsData.payload.length > 0 ? (
                <Pie
                  onElementsClick={(el) => {
                    if (el.length > 0) {
                      console.log(creatorsData.payload.slice(0, 30)[el[0]._index]);
                    }
                  }}
                  height={isLgWidth ? '100%' : 300}
                  labels={creatorsData.payload.slice(0, 30).map(da => da.creatorName)}
                  data={
                    creatorsData.payload.slice(0, 30)
                      .map(da => da.total_ad_exposure_amount)}
                  options={{
                    plugins: { colorschemes: { scheme: 'tableau.Classic20' } },
                    legend: { display: true, position: isLgWidth ? 'right' : 'bottom' },
                  }}
                />
              ) : (
                <Pie height="100%" data={[0, 1]} />
              )}
            </div>
          )}

          {tabValue === 2 && (
            <Bar
              height={isLgWidth ? '100%' : 300}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'January', 'February', 'March', 'April', 'May', ],
                datasets: [
                  {
                    stack: '1',
                    label: 'Rainfall',
                    borderWidth: 2,
                    data: [65, 59, 80, 81, 56, 65, 59, 80, 81, 56, ],
                  },
                  {
                    stack: '1',
                    label: 'Rainfall2',
                    borderWidth: 2,
                    data: [12, 39, 34, 14, 56, 65, 59, 80, 81, 56, ]
                  }
                ]
              }}
              options={{
                plugins: {
                  colorschemes: {
                    scheme: 'tableau.Classic20'
                  }
                },
                tooltips: { mode: 'index', intersect: false, responsive: false },
                aspectRatio: 2
              }}
            />
          )}
        </div>

      </div>
    </Paper>
  );
}
