import React from 'react';
import { Paper, Typography, Divider } from '@material-ui/core';
import LineChart from '../../../../../atoms/Chart/LineChart';

export default function CanvasForChart() {
  return (
    <Paper style={{ height: 600 }}>

      <div>
        <div style={{ padding: 16 }}>
          <Typography variant="h6">
            차트
          </Typography>
        </div>
        <Divider />

        <div style={{ padding: 16 }}>
          <LineChart
            labels={['12월 4일', '12월 4일', '12월 4일', '12월 4일', '12월 4일', '12월 4일', '12월 4일']}
            dataSet={[0, 0, 0, 5, 3, 0, 8]}
            height="100%"
          />
        </div>

      </div>
    </Paper>
  );
}
