import React from 'react';
import ReactTooltip from 'react-tooltip';
import Heatmap from 'react-calendar-heatmap';
import getMeanStd from './getMeanStd';

type ViewerData = { date: string; count: number; viewer: number};
interface ViewerHeatmapProps {
  data: ViewerData[];
}
export default function ViewerHeatmap(props: ViewerHeatmapProps): JSX.Element {
  const { data } = props;

  const getTooltipDataAttrs = (value: ViewerData): { 'data-tip': string } | null => {
    // Temporary hack around null value.date issue
    if (!value || !value.date) {
      return null;
    }
    // Configuration for react-tooltip
    return {
      'data-tip': `${value.date}, ${value.count} 개의 상호작용 발생`,
    };
  };

  const { mean, stddev } = getMeanStd(data.map((d) => (d.count)));

  return (

    <div style={{ height: 200, overflowX: 'auto' }}>

      <Heatmap
        showMonthLabels
        showWeekdayLabels
        startDate={data[0].date}
        endDate={data[data.length - 1].date}
        weekdayLabels={data.filter(
          (item, index) => data.indexOf(item) === index
        ).map((r) => String(r))}
        monthLabels={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
          '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']}
        values={data.map((d) => ({ ...d, value: d.viewer }))}
        tooltipDataAttrs={getTooltipDataAttrs}
        onClick={(value) => { console.log(value); }}
        classForValue={(value) => {
          if (!value) { return 'color-empty'; }
          if (value.count < mean - (2 * stddev)) { return 'color-github-0'; }
          if (value.count < mean - stddev) { return 'color-github-1'; }
          if (value.count < mean) { return 'color-github-2'; }
          if (value.count < mean + stddev) { return 'color-github-3'; }
          return 'color-github-4';
        }}
      />
      <ReactTooltip type="success" effect="solid" />
    </div>
  );
}

// {
//   "data":[
//     {"date":"19-12-23","time":0,"viewer":4182},
//       {"date":"19-12-23","time":1,"viewer":3045},
//       {"date":"19-12-23","time":2,"viewer":0}]}
