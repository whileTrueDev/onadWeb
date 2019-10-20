import React from 'react';
import shortid from 'shortid';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Container from '@material-ui/core/Container';
import Slide from '@material-ui/core/Slide';
import Grow from '@material-ui/core/Grow';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Typography from '../../Main/components/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(0),
    overflow: 'hidden',
  },
  cardWrapper: {
    zIndex: 1,
  },
  card: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  },
  cardContent: {
    maxWidth: 500,
    marginLeft: 20
  },
  imagesWrapper: {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 75,
    right: 0,
    bottom: 0,
    width: '100%',
    maxWidth: 400,
  },
}));

const LeftCreator = (props) => {
  const {
    source, triggerThreshold, growCheck, growTime, slideTime,
  } = props;
  const classes = useStyles();

  // Value for image comming slide animation
  const [trigger, setTrigger] = React.useState(
    useScrollTrigger(
      { threshold: triggerThreshold, disableHysteresis: false },
    ),
  );

  React.useEffect(() => {
    function scrollTrigger() {
      if (window.scrollY > triggerThreshold) {
        setTrigger(true);
      } else {
        setTrigger(false);
      }
    }
    scrollTrigger();
  });

  return (
    <Grow
      in={growCheck}
      {...(growCheck
      // trigger -> true
        ? { timeout: growTime }
      // trigger -> false
        : { timeout: growTime })}
    >
      <Container className={classes.root} component="section">
        <Grid container>
          <Grid item xs={12} md={6} className={classes.cardWrapper}>
            <div className={classes.card}>
              <div className={classes.cardContent}>
                <Typography variant="h4" marked="centerC" align="center" gutterBottom style={{ wordBreak: 'keep-all' }}>
                  {source.head}
                </Typography>
                <Typography variant="h5">
                  {source.body.split('\n').map((row, index) => (
                    <p key={shortid.generate()} style={{ fontFamily: 'Noto Sans kr', fontSize: 18, wordBreak: 'keep-all' }}>{`${row}`}</p>
                  ))}
                </Typography>
              </div>
            </div>
          </Grid>
          <Slide
            in
            direction="left"
            {...(trigger
            // trigger -> true
              ? { timeout: slideTime }
            // trigger -> false
              : { timeout: slideTime })}
          >
            <Grid item xs={12} md={6} className={classes.imagesWrapper}>
              <Hidden smDown>
                <img
                  src={source.image}
                  alt={source.image}
                  className={classes.image}
                />
              </Hidden>
            </Grid>
          </Slide>
        </Grid>
      </Container>
    </Grow>
  );
};


LeftCreator.propTypes = {
  source: PropTypes.object, // text sources
  growCheck: PropTypes.bool.isRequired, // grow animation trigger
  growTime: PropTypes.number, // grow animation timeout time
  triggerThreshold: PropTypes.number, // slide animation trigger threshold
  slideTime: PropTypes.number, // slide animation timeout time
};

LeftCreator.defaultProps = {
  source: '',
  triggerThreshold: 100,
  growTime: 1000,
  slideTime: 1000,
};


export default LeftCreator;
