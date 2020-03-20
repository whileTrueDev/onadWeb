import React from 'react';
// @material-ui/core components
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid, { GridProps } from '@material-ui/core/Grid';

const useStyles = makeStyles({
  grid: {
    padding: '0 15px !important',
  },
});

function GridItem({ children, ...rest }: GridProps): JSX.Element {
  const classes = useStyles();
  return (
    <Grid item {...rest} className={classes.grid}>
      {children}
    </Grid>
  );
}

export default GridItem;
