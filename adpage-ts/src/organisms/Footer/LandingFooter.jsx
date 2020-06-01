import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing(3),
      fontSize: 10,
    },
  },
  logo: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    width: '30px',
  },
}));

export default function LandingHero() {
  const classes = useStyles();

  return (
    <Grid
      container
      justify="center"
      direction="column"
      alignItems="center"
      className={classes.root}
      component="footer"
    >
      <a href="https://onad.io">
        <img src="/images/logo/onad_logo_vertical.png" alt="" className={classes.logo} />
      </a>
      <Typography variant="body2">Powered by OnAD</Typography>
      <Typography variant="body2">whileTrue Corp. All Rights Reserved</Typography>
    </Grid>
  );
}
