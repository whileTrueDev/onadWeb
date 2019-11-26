import React from 'react';
import ReactTooltip from 'react-tooltip';
import Heatmap from 'react-calendar-heatmap';
import getMeanStd from './getMeanStd';
import './heatmap.css';

const data = [
  {
    date: '2019-11-09',
    count: 12,
  },
  {
    date: '2019-11-10',
    count: 71,
  },
  {
    date: '2019-11-11',
    count: 84,
  },
  {
    date: '2019-11-12',
    count: 85,
  },
  {
    date: '2019-11-13',
    count: 126,
  },
  {
    date: '2019-11-14',
    count: 56,
  },
  {
    date: '2019-11-15',
    count: 61,
  },
  {
    date: '2019-11-16',
    count: 109,
  },
  {
    date: '2019-11-17',
    count: 129,
  },
  {
    date: '2019-11-18',
    count: 63,
  },
];

export default function ClickHeatmap() {
  const getTooltipDataAttrs = (value) => {
    // Temporary hack around null value.date issue
    if (!value || !value.date) {
      return null;
    }
    // Configuration for react-tooltip
    return {
      'data-tip': `${value.date}, ${value.count} 개의 상호작용 발생`,
    };
  };

  const { mean, stddev } = getMeanStd(data.map(d => (d.count)));


  return (
    <div style={{ height: 200, overflowX: 'auto' }}>

      <Heatmap
        showMonthLabels
        showWeekdayLabels
        weekdayLabels={['일', '월', '화', '수', '목', '금', '토']}
        monthLabels={['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']}
        values={data}
        tooltipDataAttrs={getTooltipDataAttrs}
        onClick={(value) => { console.log(value); }}
        classForValue={(value) => {
          if (!value) { return 'color-empty'; }
          if (value.count < mean - (2 * stddev)) { return 'color-github-0'; }
          if (value.count < mean - stddev) { return 'color-github-1'; }
          if (value.count < mean) { return 'color-github-2'; }
          if (value.count < mean + stddev) { return 'color-github-3'; }
          return 'color-github-4';
        }
    }
      />
      <ReactTooltip type="success" effect="solid" />
    </div>
  );
}
