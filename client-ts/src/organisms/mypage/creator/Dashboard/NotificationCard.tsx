import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import useNotificationCardStyles from './NotificationCard.style';

const ContractionCard = (): JSX.Element => {
  const classes = useNotificationCardStyles();
  return (

    <Alert severity="error">
      <Grid container direction="row" spacing={1}>
        <Grid item container direction="row" className={classes.text}>
          <Grid item>
            <Typography className={classes.body}>
              배너 권장 크기는 방송의 해상도에 따라
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.head}>
              320 X 160
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.middle}>
              (1080p60),
            </Typography>
          </Grid>
          <Grid item>&nbsp;</Grid>
          <Grid item>
            <Typography className={classes.head}>
              214 X 107
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.middle}>
              (720p60)
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.tail}>
              이상 비율은
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.head}>
              2:1 고정
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.body}>
              입니다.
            </Typography>
          </Grid>
        </Grid>
        <Grid item container direction="row" className={classes.text}>
          <Grid item>
            <Typography className={classes.body}>
              * 배너 크기 규정 위반 시 이용약관 제 10조 3항에 의거하여 해당 배너 송출과 관련한 적립금이
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.warning}>
              무효화
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.body}>
              될 수 있습니다.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Alert>
  );
};

export default ContractionCard;
