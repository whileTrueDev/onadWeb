import React from 'react';
import { Grow } from '@material-ui/core';
import styles from './style/Introduction.style';
import useLoginValue from '../../utils/hooks/useLoginValue';
import AppAppBar from '../../organisms/main/layouts/AppAppbar';
import HowToUseCreator from '../../organisms/main/Introduction/HowToUseCreator';
import HowToUseMarketer from '../../organisms/main/Introduction/HowToUseMarketer';
import IntroduceMiddle from '../../organisms/main/Introduction/IntroduceMiddle';
import ProductHowItWorks from '../../organisms/main/main/HowItWorks/ProductHowItWorks';
import sources from '../../organisms/main/main/source/sources';
import AppFooter from '../../organisms/main/layouts/AppFooter';
import textSource from '../../organisms/main/Introduction/source/textSource';
import Question from '../../organisms/main/Introduction/Question';


export interface Props {
  match: {
    params: { userType: string | boolean };
  };
}


// this is layout compoent
export default function Introduction({ match }: Props): JSX.Element {
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
                    {textSource.heroSector.marketer.text.content.split('\n').map((row: string) => (
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
            MainUserType="marketer"
            logout={logout}
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
                      {textSource.heroSector.creator.text.content.split('\n').map((row: string) => (
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
              MainUserType="creator"
              logout={logout}
            />
            <Question MainUserType="creator" />
            <AppFooter />
          </div>
        )}
    </div>
  );
}
