import React from 'react';

import { Link } from 'react-router-dom';
import Grow from '@material-ui/core/Grow';
// import Button from '../../components/Button';
import Button from '@material-ui/core/Button';
import ProductHeroLayout from './ProductHeroLayout';
import styles from '../style/ProductHero.style';

interface Props {
  MainUserType: string;
  source: {
    text: {
      title: string;
      subTitle: string;
      marketerTail: string;
      creatorTail: string;
    };
  };
}

function ProductHero({ MainUserType, source }: Props): JSX.Element {
  const classes = styles();

  return (
    <ProductHeroLayout MainUserType={MainUserType}>
      {MainUserType === 'marketer' ? (
        <div className={classes.maintop}>
          <div className={classes.loginButtonLeft}>
            <Grow in timeout={1500}>
              <h1 className={classes.h1}>
                {source.text.title}
              </h1>
            </Grow>
            <Grow in timeout={1500}>
              <h1 className={classes.h1}>
                {source.text.subTitle}
              </h1>
            </Grow>
            <div className={classes.h1sub}>
              {source.text.marketerTail.split('\n').map((row) => (
                <p key={row}>{`${row}`}</p>
              ))}
            </div>
            <Button
              className={classes.buttonLeft}
              component={Link}
              to="/introduce/marketer"
            >
              + 자세히보기
            </Button>
            <Button
              className={classes.buttonRight}
              onClick={(): void => { window.open('http://pf.kakao.com/_xoyxmfT/chat'); }}
            >
              실시간 문의하기
            </Button>
          </div>

          <video className={classes.maintopCenterVideo} autoPlay loop>
            <source src="/video/main/mainMarketer.mp4" type="video/mp4" />
            <track />
          </video>
        </div>
      )
        : (
          <div className={classes.maintop}>
            <div className={classes.loginButtonLeft}>
              <Grow in timeout={1500}>
                <h1 className={classes.h1}>
                  {source.text.title}
                </h1>
              </Grow>
              <Grow in timeout={1500}>
                <h1 className={classes.h1}>
                  {source.text.subTitle}
                </h1>
              </Grow>
              <div className={classes.h1sub}>
                {source.text.creatorTail.split('\n').map((row) => (
                  <p key={row}>{`${row}`}</p>
                ))}
              </div>
              <Button
                className={classes.buttonLeft}
                component={Link}
                to="/introduce/creator"
              >
                + 자세히보기
              </Button>
              <Button
                className={classes.buttonRight}
                onClick={(): void => { window.open('http://pf.kakao.com/_xoyxmfT/chat'); }}
              >
                실시간 문의하기
              </Button>
            </div>

            <video className={classes.maintopCenterVideo} autoPlay loop>
              <source src="/video/main/mainMarketer.mp4" type="video/mp4" />
              <track />
            </video>
          </div>
        )}
    </ProductHeroLayout>
  );
}

export default ProductHero;
