import { Paper, Typography } from '@material-ui/core';
import React from 'react';

export default function AnotherCard(): JSX.Element {
  return (
    <Paper style={{
      height: 200, padding: 32, marginBottom: 16,
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <div>
          <Typography>배너광고수익</Typography>
          <Typography variant="h4" style={{ fontWeight: 'bold' }}>2000만원</Typography>
        </div>
        <div>
          <Typography>클릭광고수익</Typography>
          <Typography variant="h4" style={{ fontWeight: 'bold' }}>1500만원</Typography>
        </div>
        <div>
          <Typography>채팅광고수익</Typography>
          <Typography variant="h4" style={{ fontWeight: 'bold' }}>1800만원</Typography>
        </div>
      </div>
    </Paper>
  );
}
