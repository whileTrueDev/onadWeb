import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
// material-ui
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
// own handler
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles(theme => ({
  root: {
    borderTop: '0.5px solid',
    marginTop: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(2),
    },
  },
  imageSection: {
    marginTop: theme.spacing(5)
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(5)
    }
  },
  imageButton: {
    cursor: 'pointer',
    marginTop: 27,
    marginLeft: 15,
    marginRight: 15,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      marginRight: 0,
    },
    '&:hover $imageDesc': {
      display: 'flex',
      zIndex: 1,
    },
    '&:hover $imageBackdrop': {
      display: 'block',
    },
  },
  imageDesc: {
    opacity: 1,
    display: 'none',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  },
  imageBackdrop: {
    opacity: 0.3,
    display: 'none',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
  },
  image: {
    maxHeight: 293,
    width: 293,
    [theme.breakpoints.down('sm')]: {
      width: 'calc( 100% - 5px )',
    },
    [theme.breakpoints.down('xs')]: {
      width: 'calc( 100% - 5px )',
    },
  },
  iconOnImage: {
    width: 60,
    fontSize: 30,
    fontWeight: 'bold'
  }
}));

const dummyArray = ['', '', '', '', '', ''];

export default function LandingImageLoading(props) {
  const { isDesktopWidth } = props;
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <Skeleton height={25} />
      </Grid>

      {/* Image section */}
      <Grid container justify={isDesktopWidth ? "flex-start" : "center"}  alignItems="center" spacing={isDesktopWidth ? 0 : 0} className={classes.imageSection}>
        {dummyArray.map(() => (
          <Grid item xs={10} md={3} key={shortid.generate()}>
            <div className={classes.imageContainer}>
              <Skeleton className={classes.image} height={isDesktopWidth ? 280 : 280} />
            </div>
          </Grid>
        ))}
      </Grid>

    </Grid>
  );
}

LandingImageLoading.propTypes = {
  isDesktopWidth: PropTypes.bool.isRequired,
};
