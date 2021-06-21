import React from 'react';
import { Typography, Button } from '@material-ui/core';
import shortid from 'shortid';
import styles from './style/Introduction.style';
import useLoginValue from '../../utils/hooks/useLoginValue';
import NavTop from '../../organisms/main/layouts/NavTop';
import HowToUseCreator from '../../organisms/main/Introduction/HowToUseCreator';
import HowToUseMarketer from '../../organisms/main/Introduction/HowToUseMarketer';
import IntroduceMiddle from '../../organisms/main/Introduction/IntroduceMiddle';

import AppFooter from '../../organisms/main/layouts/AppFooter';
import textSource from '../../organisms/main/Introduction/source/textSource';
import Question from '../../organisms/main/Introduction/Question';
import IntroContact from '../../organisms/main/main/Contact/IntroContact';
import openKakaoChat from '../../utils/openKakaoChat';

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

  React.useEffect(() => {
    const glassElement = document.getElementById('glass');
    document.addEventListener('mousemove', e => {
      glassElement!.style.left = `${e.offsetX}px`;
      glassElement!.style.top = `${e.offsetY}px`;
      glassElement!.style.display = 'block';
    });
  }, []);

  return (
    <div>
      {userType === 'marketer' ? (
        <div>
          <NavTop isLogin={isLogin} MainUserType logout={logout} />
          <div className={classes.root}>
            <div className={classes.wrapper}>
              <div className={classes.mainTop}>
                {textSource.heroSector.marketer.text.title.map((text: string) => (
                  <Typography className={classes.mainTitle} variant="h3" key={shortid.generate()}>
                    {text}
                  </Typography>
                ))}
                <div className={classes.middleLine} />
                <Typography variant="h5" className={classes.subtitle}>
                  {textSource.heroSector.marketer.text.content}
                </Typography>
                <div className={classes.imageWrapper}>
                  <div className={classes.glassEffect} id="glass" />
                  <img
                    src="/introduction/marketerIntro.svg"
                    className={classes.topImage}
                    alt="Intro"
                  />
                </div>
              </div>

              <HowToUseMarketer source={textSource.marketer.secondSector} />

              <IntroduceMiddle userType={userType} />

              <Question MainUserType="marketer" />
            </div>
          </div>
          <IntroContact MainUserType isLogin={isLogin} logout={logout} />
          <AppFooter />
        </div>
      ) : (
        <div>
          <NavTop isLogin={isLogin} MainUserType={false} logout={logout} />
          <div className={classes.root}>
            <div className={classes.wrapper}>
              <div className={classes.mainTop}>
                {textSource.heroSector.creator.text.title.map((text: string) => (
                  <Typography className={classes.mainTitle} variant="h3" key={shortid.generate()}>
                    {text}
                  </Typography>
                ))}
                <div className={classes.middleLine2} />
                <Typography variant="h5">{textSource.heroSector.marketer.text.content}</Typography>
                <div className={classes.imageWrapper}>
                  <div className={classes.glassEffect} id="glass" />
                  <img
                    src="/introduction/creatorIntro.svg"
                    className={classes.topImage}
                    alt="Intro"
                  />
                </div>
              </div>

              <HowToUseCreator source={textSource.creator.secondSector} />

              <IntroduceMiddle userType={userType} />

              <Question MainUserType="creator" />
            </div>
          </div>
          <IntroContact MainUserType={false} isLogin={isLogin} logout={logout} />
          <AppFooter />
        </div>
      )}
      <Button className={classes.kakaoContact} onClick={openKakaoChat} />
    </div>
  );
}
