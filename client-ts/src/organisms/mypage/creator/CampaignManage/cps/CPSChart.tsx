import { CircularProgress, makeStyles, Paper, Typography, useTheme } from '@material-ui/core';
import classnames from 'classnames';
import React, { useMemo } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import makeBarChartData2 from '../../../../../utils/chart/makeBarChartData';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';

const CPS_CHART_CONTAINER_HEIGHT = 400;
const useStyles = makeStyles(theme => ({
  container: { height: CPS_CHART_CONTAINER_HEIGHT },
  title: { marginBottom: theme.spacing(2), fontWeight: 'bold' },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export interface CpsChartData {
  date: string;
  value: number;
  type: 'CPS';
}

export interface CPSChartProps {
  cpsChartData: UseGetRequestObject<CpsChartData[]>;
}

export default function CPSChart({ cpsChartData }: CPSChartProps): React.ReactElement {
  const classes = useStyles();
  const theme = useTheme();

  const preprocessed = useMemo(() => {
    if (cpsChartData.data) {
      return makeBarChartData2(cpsChartData.data, [{ typeName: 'CPS', to: 'cps_value' }]);
    }
    return [];
  }, [cpsChartData]);

  const CPS_LABEL = '판매수익';

  const tooltipLabelFormatter = (label: string | number): string | number => label;
  const tooltipFormatter = (value: any): any => [value, CPS_LABEL];
  const legendFormatter = (): string => CPS_LABEL;

  return (
    <Paper
      style={{
        padding: theme.spacing(4),
        height: CPS_CHART_CONTAINER_HEIGHT,
        marginTop: theme.spacing(1),
      }}
    >
      <Typography className={classes.title}>최근 판매 수익 그래프</Typography>

      {preprocessed.length === 0 && cpsChartData.loading && (
        <div className={classnames(classes.center, classes.container)}>
          <CircularProgress />
        </div>
      )}

      {!cpsChartData.loading && (
        <ResponsiveContainer width="100%" height={CPS_CHART_CONTAINER_HEIGHT}>
          <LineChart
            data={preprocessed}
            margin={{
              top: theme.spacing(2),
              right: theme.spacing(4),
              left: theme.spacing(2),
              bottom: theme.spacing(2),
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip labelFormatter={tooltipLabelFormatter} formatter={tooltipFormatter} />
            <Legend formatter={legendFormatter} />
            <Line
              type="monotone"
              dataKey="cps_value"
              stroke={theme.palette.primary.main}
              activeDot={{ r: theme.spacing(1) }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}
