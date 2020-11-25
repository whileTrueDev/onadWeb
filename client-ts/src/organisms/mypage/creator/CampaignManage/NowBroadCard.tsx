import { Paper, Typography } from '@material-ui/core';
import React from 'react';

export default function NowBroadCard(): JSX.Element {
  return (
    <Paper style={{
      height: 200, padding: 32, marginBottom: 16,
    }}
    >
      <Typography style={{ fontWeight: 'bold' }}>현재 송출중 광고</Typography>

      <div style={{ display: 'flex', }}>
        <div style={{ maxHeight: 160, maxWidth: 320, marginRight: 16 }}>
          <img
            alt=""
            src="https://images.unsplash.com/photo-1593642532871-8b12e02d091c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1300&q=80"
            style={{ maxHeight: 160, width: '100%' }}
          />
        </div>

        <div style={{ maxWidth: 400, }}>
          <Typography>현재송출중배너이름</Typography>
          <Typography>현재송출중배너링크</Typography>
          <Typography variant="caption" color="textSecondary">현재송출중배너날짜</Typography>
          <Typography>현재송출중배너진행상태</Typography>
          <Typography>광고타입</Typography>
          <Typography>광고설명광고설명광고설명광고설명광...</Typography>
          <Typography>cash, cpm, cpc: 1000원 2000원 3000원</Typography>
        </div>
      </div>
    </Paper>
  );
}
