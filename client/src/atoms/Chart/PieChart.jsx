import React from 'react';
import { Pie } from 'react-chartjs-2';
import chartTheme from './chartTheme';

export default function PieChart(props) {
  const { labels, data, ...rest } = props;
  return (
    <Pie
      {...rest}
      redraw
      data={{
        labels,
        datasets: [{
          data,
          backgroundColor: chartTheme.pie
        }],
      }}
    />
  );
}
