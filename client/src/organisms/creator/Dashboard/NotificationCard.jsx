import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Grid, Typography, Divider } from '@material-ui/core';
import CardBody from '../../../atoms/Card/CardBody';
import Card from '../../../atoms/Card/Card';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    heigth: '100%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    margin: 0,
    marginBottom: '10px',
    fontSize: '1.6rem',
    fontWeight: '700'
  },
  body: {
    marginRight: '4px',
    fontSize: '0.9rem',
  },
  head: {
    marginRight: '4px',
    fontSize: '1.05rem',
    fontWeight: '700'
  },
  middle: {
    marginRight: '4px',
    fontSize: '0.8rem',
    fontWeight: '700'
  },
  tail: {
    marginRight: '4px',
    fontSize: '0.9rem',
    fontWeight: '700'
  },
  text: {
    alignItems: 'center'
  },
  warning: {
    marginRight: '4px',
    fontSize: '0.95rem',
    fontWeight: '700',
    color: 'red',
  }
}));


const ContractionCard = () => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardBody>
        <Grid container direction="row" spacing={2}>
          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
            <span role="img" aria-label="알림" style={{ fontSize: '2.3rem' }}>
            ⚠️
            </span>
          </Grid>
          <Grid item>
            <Divider orientation="vertical" />
          </Grid>
          <Grid item>
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <Grid container direction="row" className={classes.text}>
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
              </Grid>
              <Grid item>
                <Grid container direction="row" className={classes.text}>
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
            </Grid>
          </Grid>
        </Grid>
      </CardBody>
    </Card>
  );
};

export default ContractionCard;
