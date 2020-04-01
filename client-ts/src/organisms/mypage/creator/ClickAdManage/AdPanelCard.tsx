import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Paper, Typography, FormControlLabel, Switch, Divider
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: { maxheight: 100 },
  head: { display: 'flex', justifyContent: 'space-between', padding: theme.spacing(2) },
  body: { padding: theme.spacing(2) },
  emphasizedText: {
    color: theme.palette.secondary.main, fontWeight: theme.typography.fontWeightBold
  }
}));

export default function AdPanelCard(): JSX.Element {
  const classes = useStyles();
  return (
    <>
      <Paper className={classes.paper}>
        <div className={classes.head}>
          <Typography variant="h6">
            패널 광고 설정
          </Typography>
        </div>

        <Divider />

        <div className={classes.body}>
          <div style={{ textAlign: 'center' }}>
            <img src="/pngs/dashboard/clickad_panel_example.png" alt="panel_example" style={{ maxWidth: '100%' }} />
          </div>
          <Typography variant="body2">
            패널광고는 자신의 채널 하단의 패널에 광고 링크를 가진 이미지를 띄워
          </Typography>
          <br />
          <Typography variant="body2">
            시청자가 광고 패널을 클릭하면 현재 진행 중인 광고의 링크로 바로 이동하게 됩니다.
          </Typography>
        </div>
      </Paper>
    </>
  );
}
