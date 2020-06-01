import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    borderTop: '0.5px solid'
  },
  h2: {
    marginTop: theme.spacing(4),
    fontSize : "22px"
  }
}));

export default function LandingNoAd() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <h2 className={classes.h2}>현재 이 크리에이터가 진행중인 클릭광고가 없습니다.</h2>
    </div>
  );
}
