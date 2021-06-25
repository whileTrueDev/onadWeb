import { CircularProgress, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(() => ({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
}));

export default function CenterLoading(): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <CircularProgress />
    </div>
  );
}
