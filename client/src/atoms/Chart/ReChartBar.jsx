import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { useTheme } from '@material-ui/core/styles';
import makeBarChartData from './makeBarChartData';

export default function ReChartBar(props) {
  const {
    data, legend, containerHeight, chartHeight,
    chartWidth, xAxisDataKey, yAxisDataKey,
    tooltipFormatter, tooltipLabelFormatter,
    legendFormatter, dataKey, nopreprocessing
  } = props;

  const theme = useTheme();

  return (
    <div style={{ height: containerHeight, width: '99%' }}>
      <ResponsiveContainer>
        <BarChart
          width={chartWidth}
          height={chartHeight}
          data={nopreprocessing ? data : makeBarChartData(data)}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisDataKey} />
          <YAxis dataKey={yAxisDataKey} />
          <Tooltip
            cursor={{ stroke: theme.palette.primary.main, strokeWidth: 1 }}
            labelFormatter={tooltipLabelFormatter}
            formatter={tooltipFormatter}
          />
          {legend && (
            <Legend
              iconType="circle"
              formatter={legendFormatter}
            />
          )}

          <Bar
            dataKey={dataKey instanceof Array ? dataKey[0] : dataKey}
            stackId="a"
            fill={theme.palette.primary.light}
          />
          {dataKey instanceof Array ? (
            <Bar
              dataKey={dataKey[1]}
              stackId="a"
              fill={theme.palette.secondary.light}
            />
          ) : (null)}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

ReChartBar.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  legend: PropTypes.bool,
  containerHeight: PropTypes.number,
  chartHeight: PropTypes.number,
  chartWidth: PropTypes.number,
  xAxisDataKey: PropTypes.string,
  yAxisDataKey: PropTypes.string,
  tooltipFormatter: PropTypes.func,
  tooltipLabelFormatter: PropTypes.func,
  legendFormatter: PropTypes.func,
  nopreprocessing: PropTypes.bool,
  dataKey: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string])
};

ReChartBar.defaultProps = {
  legend: true,
  dataKey: ['cpm_amount', 'cpc_amount'],
  containerHeight: 400,
  chartHeight: 300,
  chartWidth: 500,
  xAxisDataKey: 'date',
  yAxisDataKey: 'cpm_amount',
  tooltipFormatter(value, name) {
    if (name === 'cpm_amount') { return [value, '배너광고']; } return [value, '클릭광고'];
  },
  tooltipLabelFormatter: null,
  legendFormatter(value) {
    if (value === 'cpm_amount') { return '배너광고'; } return '클릭광고';
  },
  nopreprocessing: false,
};
