import { Button, makeStyles, Paper, Typography } from '@material-ui/core';
import { OpenInNew } from '@material-ui/icons';
import React from 'react';
import openKakaoChat from '../../../../utils/openKakaoChat';

const useStyles = makeStyles(() => ({
  paper: { maxheight: 100 },
  div: { display: 'flex', justifyContent: 'space-between', padding: 16 },
}));
export default function MarketerCustomerServiceCard(): JSX.Element {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <div className={classes.div}>
        <Typography variant="h6">실시간 문의</Typography>

        <Button variant="outlined" size="small" color="primary" onClick={openKakaoChat}>
          문의하기
          <OpenInNew fontSize="small" style={{ verticalAlign: 'middle' }} />
        </Button>
      </div>
    </Paper>
  );
}
