import React from 'react';
import {
  Grow, Slide, useScrollTrigger, Grid, Button
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import styles from '../style/HowToUse.style';
// import Button from '../../../../../atoms/CustomButtons/Button';

interface Props {
  source: {
    title: string;
    subTitle: string;
    textMarketer: string;
    textCreator: string;
  };
  slideTime: number;
  MainUserType: string;
}

function HowToUse({ source, slideTime, MainUserType }: Props): JSX.Element {
  const classes = styles();
  const trigger = useScrollTrigger({ threshold: 550, disableHysteresis: true });

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
              {source.textMarketer.split('\n').map((row) => (
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
      )
        : (
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
              <img src="/pngs/main/howtouseCreator.png" alt="Howto" className={classes.step} />
              <div className={classes.h1sub}>
                {source.textCreator.split('\n').map((row) => (
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
