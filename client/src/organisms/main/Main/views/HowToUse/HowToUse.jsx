import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grow, Slide, useScrollTrigger, Grid
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';

const styles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10),
  },
  loginButtonRight: {
    color: 'black',
    textAlign: 'left',
    width: '20%',
    fontSize: '20px',
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.down('xs')]: {
      width: '80%',
    },
    [theme.breakpoints.down('md')]: {
      width: '40%',
      marginLeft: 0,
      textAlign: 'left',
    },
    [theme.breakpoints.down('sm')]: {
      width: '90%',
      marginLeft: 0,
      textAlign: 'left',
    },
  },
  h1: {
    marginTop: '0px',
    marginBottom: '5px',
    fontSize: 45,
    fontWeight: 500,
    [theme.breakpoints.down('md')]: {
      fontSize: 35,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 27,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 25,
    },
    color: 'black',
    fontFamily: 'Noto Sans KR',
  },
  h2: {
    marginTop: '5px',
    marginBottom: '20px',
    fontSize: 45,
    fontWeight: 600,
    [theme.breakpoints.down('md')]: {
      fontSize: 35,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 27,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 25,
    },
    color: 'black',
    fontFamily: 'Noto Sans KR',
  },
  h1sub: {
    marginTop: 40,
    marginBottom: 40,
    color: 'black',
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.up('md')]: {
      margin: '30px 0px',
      wordBreak: 'keep-all'
    },
    [theme.breakpoints.up('sm')]: {
      margin: '10px 0px',
      wordBreak: 'keep-all'
    },
    [theme.breakpoints.down('sm')]: {
      margin: '20px 0px',
      wordBreak: 'keep-all'
    },
  },
  mainMiddle: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      justifyContent: 'center',
    },
  },
  mainMiddleLeftVideo: {
    width: '650px',
    height: '440px',
    [theme.breakpoints.down('md')]: {
      width: '540px',
      height: '380px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '380px',
      height: '280px',
    },
    [theme.breakpoints.down('xs')]: {
      width: '300px',
      height: '240px',
    },
  },
  buttonRight: {
    width: '210px',
    color: '#3154EB',
    borderRadius: '5px',
    border: '1px solid #3154EB',
    fontSize: 18,
    padding: 10,
    [theme.breakpoints.down('md')]: {
      width: '210px',
      fontSize: 18,
    },
    [theme.breakpoints.down('sm')]: {
      width: '170px',
      fontSize: 13,
    },
    [theme.breakpoints.down('xs')]: {
      width: '170px',
      fontSize: 13,
    },
  },
  text: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 16,
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.down('md')]: {
      fontSize: 15,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 13,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 15,
    },
  },
  step: {
    width: 400,
    height: 120,
    [theme.breakpoints.down('md')]: {
      width: '300px',
      height: '100px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '250px',
      height: '85px',
    },
    [theme.breakpoints.down('xs')]: {
      width: '250px',
      height: '85px',
    },
  },
  slide: {
    marginRight: 80,
    width: '650px',
    height: '440px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      width: '540px',
      height: '380px',
      marginRight: 60,
    },
    [theme.breakpoints.down('sm')]: {
      width: '380px',
      height: '280px',
      marginRight: 40,
    },
    [theme.breakpoints.down('xs')]: {
      width: '300px',
      height: '240px',
      marginRight: 0,
    },
  }
}));

function HowToUse(props) {
  const {
    source, slideTime, MainUserType
  } = props;
  const classes = styles();
  const trigger = useScrollTrigger({ threshold: 850, disableHysteresis: true });

  return (
    <div className={classes.root}>
      {MainUserType === 'marketer' ? (
        <div className={classes.mainMiddle}>
          <Slide
            in={trigger}
            direction="right"
            {...(trigger
            // trigger -> true
              ? { timeout: slideTime }
            // trigger -> false
              : { timeout: slideTime })}
          >
            <Grid item className={classes.slide}>
              <video className={classes.mainMiddleLeftVideo} autoPlay loop>
                <source src="/video/main/howtouseMarketer.mp4" type="video/mp4" />
                <track />
              </video>
            </Grid>
          </Slide>
          <div className={classes.loginButtonRight}>
            <Grow in timeout={1500}>
              <h1 className={classes.h1}>
                {source.title}
              </h1>
            </Grow>
            <Grow in timeout={1500}>
              <h1 className={classes.h2}>
                {source.subTitle}
              </h1>
            </Grow>
            <img src="/pngs/main/howToUseMarketer.png" alt="Howto" className={classes.step} />
            <div className={classes.h1sub}>
              {source.textMarketer.split('\n').map(row => (
                <p key={row} className={classes.text}>{`${row}`}</p>
              ))}
            </div>
            <Button
              className={classes.buttonRight}
              component={Link}
              to="/introduce/marketer"
            >
              &rarr; 이용방법 자세히보기
            </Button>
          </div>
        </div>
      ) : (
        <div className={classes.mainMiddle}>
          <Slide
            in={trigger}
            direction="right"
            {...(trigger
            // trigger -> true
              ? { timeout: slideTime }
            // trigger -> false
              : { timeout: slideTime })}
          >
            <Grid item className={classes.slide}>
              <video className={classes.mainMiddleLeftVideo} autoPlay loop>
                <source src="/video/main/howtouseCreator.mp4" type="video/mp4" />
                <track />
              </video>
            </Grid>
          </Slide>
          <div className={classes.loginButtonRight}>
            <Grow in timeout={1500}>
              <h1 className={classes.h1}>
                {source.title}
              </h1>
            </Grow>
            <Grow in timeout={1500}>
              <h1 className={classes.h2}>
                {source.subTitle}
              </h1>
            </Grow>
            <img src="/pngs/main/howToUseCreator.png" alt="Howto" className={classes.step} />
            <div className={classes.h1sub}>
              {source.textCreator.split('\n').map(row => (
                <p key={row} className={classes.text}>{`${row}`}</p>
              ))}
            </div>
            <Button
              className={classes.buttonRight}
              component={Link}
              to="/introduce/creator"
            >
              &rarr; 이용방법 자세히보기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HowToUse;
