import {
  FormControlLabel, Paper, Switch, Typography
} from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import React from 'react';

export default function ChatAdInfo(): JSX.Element {
  return (
    <Paper style={{
      height: 200, padding: 32, marginBottom: 16,
    }}
    >
      <Typography style={{ fontWeight: 'bold' }}>
        내 채팅 광고 상태
        <HelpIcon fontSize="small" />
      </Typography>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
      }}
      >
        <FormControlLabel
          label="Off/On"
          control={(<Switch color="secondary" />)}
        />
      </div>
    </Paper>
  );
}
