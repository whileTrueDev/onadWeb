import React from 'react';
import { makeStyles, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(1),
    height: 250,
    overflowY: 'auto',
  },
  bold: { fontWeight: 'bold' },
  buttonSection: { marginTop: theme.spacing(2), textAlign: 'center' },
}));

export default function EventInfoCard(): JSX.Element {
  const classes = useStyles();
  return (
    <Paper className={classes.container}>
      <Typography className={classes.bold}>새로운 제품을 체험해보세요.</Typography>

      <Typography variant="caption" color="textSecondary">
        분석된 방송정보를 토대로 시청자들과 소통하세요. 방송분석 정보를 통해 쉽게 영상을 편집하세요.
      </Typography>

      <div className={classes.buttonSection}>
        <Typography
          color="primary"
          style={{ textDecoration: 'underline', cursor: 'pointer' }}
          onClick={(): void => {
            window.open('https://mytruepoint.com');
          }}
        >
          Truepoint 알아보기
        </Typography>
      </div>
    </Paper>
  );
}
