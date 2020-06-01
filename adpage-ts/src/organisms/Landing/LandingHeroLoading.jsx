import React from 'react';
import PropTypes from 'prop-types';
// material-ui
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(10),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(8),
      fontSize: 10,
    },
  },
  bigAvatar: {
    margin: 25,
    width: 200,
    height: 200,
    [theme.breakpoints.down('sm')]: {
      width: 150,
      height: 150,
    },
    [theme.breakpoints.down('xs')]: {
      width: 100,
      height: 100,
    },
  },
}));

export default function LandingHeroLoading(props) {
  const { isDesktopWidth } = props;
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      {/* Avatar logo */}
      <Grid item sm={4} xs={12}>
        <Grid container justify="center">
          <Skeleton variant="circle" className={classes.bigAvatar} />
        </Grid>
      </Grid>

      {/* My description section */}
      <Grid item sm={6} xs={12}>
        {isDesktopWidth ? (
          <Skeleton width={150} />
        ) : (
          <Grid container>
            <Grid item xs={9}>
              <Skeleton width={80} height={40} />
            </Grid>

            {/* <Grid item xs={3}>
              <Skeleton width={50} />
              <Skeleton width={80} />
            </Grid> */}
          </Grid>
        )}
        {isDesktopWidth ? (
          <Skeleton height={100} width={350} />
        ) : (
          <Skeleton height={50} width={250} />
        )}

      </Grid>

      {/* loyalty level visualization */}
      {/* {isDesktopWidth ? (
        <Grid item sm={1} xs={3}>
          <Skeleton width={130} />
          <Skeleton width={150} />
        </Grid>
      ) : (
        null
      )} */}

    </Grid>
  );
}

LandingHeroLoading.propTypes = {
  isDesktopWidth: PropTypes.bool.isRequired,
};
