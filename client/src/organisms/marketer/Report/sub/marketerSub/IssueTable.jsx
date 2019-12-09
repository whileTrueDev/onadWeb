import React from 'react';
import {
  Paper, Grid, Typography, Divider,
  List, ListItem, ListItemText
} from '@material-ui/core';

const data = ['123123', 'sadfasdf', 'asdfasdfsa', 'some information', 'some information2', 'some information3'];

export default function issueTable() {
  return (
    <Paper style={{ height: 400 }}>
      <div style={{ padding: 16 }}>
        <Typography variant="h6">
          활동
        </Typography>
      </div>

      <Divider />

      <Grid container alignItems="center" style={{ height: 330, overflow: 'auto' }}>
        {/* <List component="nav" style={{ width: '100%' }} aria-label="mailbox folders">
          {data.map((r, index) => (
            <div key={r}>
              <ListItem button style={{ justifyContent: 'space-between' }}>
                <ListItemText primary={r} secondary="2019. 09. 15." />
                <Typography variant="caption" style={{ color: 'grey' }}>2019-09-15</Typography>
              </ListItem>
              {index !== data.length - 1 && (
                <Divider light />
              )}
            </div>
          ))}
        </List> */}

        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h6" align="center" justify="center">
          [활동 내역 보기] 준비중입니다.
          </Typography>
        </div>
      </Grid>
    </Paper>
  );
}
