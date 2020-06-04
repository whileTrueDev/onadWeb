import React from 'react';
// @material-ui/core components
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  grid: {
    // margin: '0 -15px !important',
    width: 'unset',
  },
});

function GridContainer({ children, ...rest }){
  const classes = useStyles();
  return (
    <Grid container {...rest} className={classes.grid}>
      {children}
    </Grid>
  );
}

export default GridContainer;
