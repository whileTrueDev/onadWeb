import React from 'react';
import MuiCircularProgress from '@material-ui/core/CircularProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  wrapper: {
    marginTop: theme.spacing(15),
    marginBottom: theme.spacing(15),
    textAlign: 'center',
  },
}));

export default function CircularProgress() {
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <MuiCircularProgress />
    </div>
  );
}
