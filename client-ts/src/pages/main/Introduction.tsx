import React from 'react';
import { Grow } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useLoginValue from '../../utils/hooks/useLoginValue';
import AppAppBar from '../../organisms/main/layouts/AppAppbar';
import HowToUseCreator from '../../organisms/main/Introduction/HowToUseCreator';
import HowToUseMarketer from '../../organisms/main/Introduction/HowToUseMarketer';
import IntroduceMiddle from '../../organisms/main/Introduction/IntroduceMiddle';
import ProductHowItWorks from '../../organisms/main/main/views/HowItWorks/ProductHowItWorks';
import sources from '../../organisms/main/main/source/sources';
import AppFooter from '../../organisms/main/layouts/AppFooter';
import textSource from '../../organisms/main/Introduction/source/textSource';
import Question from '../../organisms/main/Introduction/Question';

const styles = makeStyles((theme) => ({
  rootWrap: {
    background: 'url(\'/pngs/introduction/marketerIntroduce.png\') no-repeat center center',
    backgroundSize: 'cover',
    width: '100%',
    height: '700px',
    [theme.breakpoints.down('md')]: {
      height: '600px',
    },
    [theme.breakpoints.down('sm')]: {
      height: '500px'
    },
    [theme.breakpoints.down('xs')]: {
      height: '450px'
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
  },
  h1: {
    marginTop: '10px',
    marginBottom: '5px',
    wordBreak: 'keep-all',
    fontSize: 40,
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
  },
  h1sub: {
    marginTop: 40,
    marginBottom: 40,
    [theme.breakpoints.down('md')]: {
      fontSize: 18,
      marginTop: 35,
      marginBottom: 35,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 15,
      marginTop: 30,
      marginBottom: 30,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      marginTop: 20,
      marginBottom: 20,
    },
  },
  maintop: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  maintopCenterVideo: {
    width: '750px',
    height: '500px',
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

interface Props {
  match: {
    params: { userType: string | boolean };
  };
}


// this is layout compoent
export default function IntroductionMain({ match }: Props): JSX.Element {
  const { isLogin, logout } = useLoginValue();
  const classes = styles();
  const { userType } = match.params;

  // if Link here, set the scroll to top of the page
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {userType === 'marketer' ? (
        <div>
          <div className={classes.rootWrap}>
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
                    {textSource.heroSector.marketer.text.content.split('\n').map((row) => (
                      <p key={row}>{`${row}`}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <section style={{ background: 'linear-gradient(60deg, #0D93BF 30%, #3154EB 90%)' }}>
            <HowToUseMarketer source={textSource.marketer.secondSector} />
          </section>

          <IntroduceMiddle userType />

          <ProductHowItWorks
            source={sources.howitworks}
          />
          <Question MainUserType="marketer" />
          <AppFooter />
        </div>
      )
        : (
          <div>
            <div className={classes.rootWrap}>
              <div className={classes.containerWrap}>
                <AppAppBar
                  isLogin={isLogin}
                  logout={logout}
                  MainUserType="creator"
                />
                <div className={classes.maintop}>
                  <div className={classes.loginMiddle}>
                    <Grow in timeout={1500}>
                      <h1 className={classes.h1}>
                        {textSource.heroSector.creator.text.title}
                      </h1>
                    </Grow>
                    <div className={classes.h1sub}>
                      {textSource.heroSector.creator.text.content.split('\n').map((row) => (
                        <p key={row}>{`${row}`}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <section style={{ background: 'linear-gradient(45deg, #FFAA00 30%, #FF8E53 90%)' }}>
              <HowToUseCreator source={textSource.creator.secondSector} />
            </section>

            <IntroduceMiddle userType={false} />

            <ProductHowItWorks
              source={sources.howitworks}
            />
            <Question MainUserType="creator" />
            <AppFooter />
          </div>
        )}
    </div>
  );
}
