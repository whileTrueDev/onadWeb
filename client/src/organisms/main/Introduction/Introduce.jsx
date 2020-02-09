import React from 'react';
import PropTypes from 'prop-types';
import { Grow } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AppAppBar from '../layout/AppAppBar';
import HowToUseMarketer from './components/HowToUseMarketer';
import IntroduceMiddle from './components/IntroduceMiddle';
import ProductHowItWorks from '../Main/views/HowItWorks/ProductHowItWorks';
import textSource from './source/textSource';
import sources from '../Main/source/sources';
import AppFooter from '../layout/AppFooter';
import Question from './components/Question';

const styles = makeStyles(theme => ({
  root: {
    background: 'url(\'/pngs/introduction/marketerIntroduce.png\') no-repeat center center',
    backgroundSize: 'cover',
    width: '100%',
    height: '800px',
    [theme.breakpoints.up('sm')]: {
    },
    [theme.breakpoints.down('md')]: {
    }
  },
  containerWrap: {
    backgroundColor: 'rgb(0,0,0, 0.6)',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginMiddle: {
    color: 'white',
    textAlign: 'left',
    width: '50%',
    fontSize: '20px',
    fontFamily: 'Noto Sans KR',
    marginRight: 30,
    [theme.breakpoints.down('md')]: {
    },
    [theme.breakpoints.down('sm')]: {

    },
    [theme.breakpoints.down('xs')]: {
    },
  },
  h1: {
    marginTop: '10px',
    marginBottom: '5px',
    fontSize: 45,
    fontWeight: 600,
    [theme.breakpoints.up('md')]: {
    },
    [theme.breakpoints.up('sm')]: {
      wordBreak: 'keep-all'
    },
    [theme.breakpoints.down('sm')]: {
      wordBreak: 'keep-all'
    },
  },
  h1sub: {
    marginTop: 40,
    marginBottom: 40,
    [theme.breakpoints.up('md')]: {
    },
    [theme.breakpoints.up('sm')]: {
    },
    [theme.breakpoints.down('sm')]: {
    },
  },
  maintop: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
    },
    [theme.breakpoints.down('xs')]: {
      // display: 'grid',
      // gridTemplateColumns: 'repeat(4, 110px)',
      // gridTemplateRows: 'repeat(2, 250px)'
    },
  },
  maintopCenterVideo: {
    width: '750px',
    height: '500px',
    [theme.breakpoints.up('lg')]: {
    },
    [theme.breakpoints.down('md')]: {
    },
    [theme.breakpoints.down('sm')]: {
    },
    [theme.breakpoints.down('xs')]: {
    },
  },
  buttonLeft: {
    width: '40%',
    backgroundColor: '#3154EB',
    borderRadius: '5px',
    fontSize: 20,
    marginRight: 20,
  },
  buttonRight: {
    width: '40%',
    borderRadius: '5px',
    border: '1px solid #3154EB',
    fontSize: 20,
  }
}));

function Introduce(props) {
  const { isLogin, logout } = props;

  const classes = styles();

  return (
    <div className={classes.root}>
      <div className={classes.containerWrap}>
        <AppAppBar
          isLogin={isLogin}
          logout={logout}
          MainUserType="marketer"
        />
        <div className={classes.maintop}>
          <div className={classes.loginMiddle}>
            <Grow in timeout={1500}>
              <h1 className={classes.h1}>
                {textSource.heroSector.marketer.text.title}
              </h1>
            </Grow>
            <div className={classes.h1sub}>
              {textSource.heroSector.marketer.text.content.split('\n').map(row => (
                <p key={row}>{`${row}`}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <section style={{ background: 'linear-gradient(60deg, #0D93BF 30%, #3154EB 90%)' }}>
        <HowToUseMarketer source={textSource.marketer.secondSector} />
      </section>

      <IntroduceMiddle source={textSource.topSector} />

      <ProductHowItWorks
        source={sources.howitworks}
      />
      <Question />
      <AppFooter />
    </div>
  );
}

export default Introduce;
