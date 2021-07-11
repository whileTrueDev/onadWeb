// material-UI
import { Typography, Button } from '@material-ui/core';
// 내부 소스
import textSource from '../source/introductionSource';
// 프로젝트 내부 모듈
import { useEffect } from 'react';
import { nanoid } from 'nanoid';
// 컴포넌트
import NavTop from '../components/layout/navTop';
import HowToUseCreator from '../components/introduction/howToUseCreator';
import HowToUseMarketer from '../components/introduction/howToUseMarketer';
import IntroduceMiddle from '../components/introduction/introduceMiddle';
import IntroContact from '../components/main/contact/introContact';
import Question from '../components/introduction/question';
import AppFooter from '../components/layout/appFooter';
// util 계열
import useLoginValue from '../utils/hooks/useLoginValue';
import openKakaoChat from '../utils/openKakaoChat';
// 스타일
import styles from '../styles/introduction/introduction.style';

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

  useEffect(() => {
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
                  <Typography className={classes.mainTitle} variant="h3" key={nanoid()}>
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
                  <Typography className={classes.mainTitle} variant="h3" key={nanoid()}>
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
