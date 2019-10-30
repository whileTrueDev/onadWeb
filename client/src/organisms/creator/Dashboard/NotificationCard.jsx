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
    fontSize: '1.0rem',
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
          <Grid item>
            <span role="img" aria-label="알림" heigth="100%" width="auto">
            ⚠️
            </span>
          </Grid>
          <Grid item>
            <Divider variant="vertical" />
          </Grid>
          <Grid item>
            <Grid container direction="row" className={classes.text}>
              <Grid item>
                <Typography className={classes.body}>
                  배너 권장 크기는
                </Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.head}>
                  320 X 160 (비율 2:1 고정) 이상
                </Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.body}>
                  입니다.
                </Typography>
              </Grid>
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
      </CardBody>
    </Card>
  );
};

export default ContractionCard;
