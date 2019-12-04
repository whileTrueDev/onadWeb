import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Grid, Paper, Divider, Typography, ButtonBase
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    padding: 16
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

export default function DescCard(props) {
  const classes = useStyles();
  const { data, ...rest } = props;
  return (
    <Paper style={{ height: 600 }}>
      <div style={{ padding: 16 }}>
        <Typography variant="h6">
          캠페인 데이터
        </Typography>
      </div>

      <Divider />

      {[1, 2, 3].map(row => (
        <div>
          <Grid container spacing={2} style={{ padding: 16 }}>
            <Grid item>
              <ButtonBase className={classes.image}>
                {/* 등록된 배너 */}
                <img className={classes.img} alt="complex" src="/pngs/logo/onad_logo_vertical_black.png" />
              </ButtonBase>
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2} style={{ padding: 8 }}>
                <Typography gutterBottom variant="subtitle1">
              캠페인 명
                </Typography>
                <Typography variant="body2" gutterBottom>
              광고 유형
                </Typography>
                <Typography variant="body2" gutterBottom>
              게재 우선순위
                </Typography>
                <Typography variant="body2" color="textSecondary">
              생성 날짜 2019. 12. 04.
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">$19.00</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Divider />
        </div>
      ))}
    </Paper>
  );
}
