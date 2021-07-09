// material-UI
import { Typography, Button } from '@material-ui/core';
// 내부 소스
// 프로젝트 내부 모듈
import { useState } from 'react';
// 컴포넌트
import ProductHeroLayout from './productHeroLayout';
import CreatorLoginForm from '../../login/creatorLoginForm';
import MarketerLoginForm from '../../login/marketerLoginForm';
// util 계열
// 스타일
import styles from '../../../styles/main/hero/productHero.style';
interface ProductHeroProps {
  MainUserType: boolean;
  source: {
    text: {
      title: string;
      beforeSubTitle: string;
      subTitle: string;
    };
    textCreator: {
      title: string;
      subTitle: string;
    };
  };
  isLogin: boolean;
  logout: () => void;
}

function ProductHero({ MainUserType, source, isLogin, logout }: ProductHeroProps): JSX.Element {
  const classes = styles();

  const [loginValue, setLoginValue] = useState('');

  function handleDialogOpenClick(newValue: string): void {
    setLoginValue(newValue);
  }

  function handleDialogClose(): void {
    setLoginValue('');
  }

  return (
    <ProductHeroLayout MainUserType={MainUserType}>
      {MainUserType ? (
        // 마케터 페이지
        <div className={classes.root}>
          <Typography align="center" variant="h4" className={classes.mainTitle}>
            {source.text.title}
          </Typography>
          <Typography align="center" variant="h4" className={classes.mainTitle}>
            <span>{source.text.beforeSubTitle}</span>
            <span>{source.text.subTitle}</span>
          </Typography>

          {!isLogin ? (
            <Button
              className={classes.loginButton}
              onClick={() => handleDialogOpenClick('marketer')}
            >
              온애드 시작하기
            </Button>
          ) : (
            <Button className={classes.loginButton} onClick={logout}>
              로그아웃
            </Button>
          )}
        </div>
      ) : (
        // 크리에이터 페이지
        <div className={classes.root}>
          <Typography align="center" variant="h4" className={classes.mainTitle}>
            {source.textCreator.title}
          </Typography>
          <Typography align="center" variant="h4" className={classes.mainTitle}>
            <span>{source.textCreator.subTitle}</span>
          </Typography>

          {!isLogin ? (
            <Button
              className={classes.loginButton2}
              onClick={() => handleDialogOpenClick('creator')}
            >
              온애드 시작하기
            </Button>
          ) : (
            <Button className={classes.loginButton2} onClick={logout}>
              로그아웃
            </Button>
          )}
        </div>
      )}
      <MarketerLoginForm
        open={loginValue === 'marketer'}
        handleClose={handleDialogClose}
        logout={logout}
      />
      <CreatorLoginForm open={loginValue === 'creator'} handleClose={handleDialogClose} />
    </ProductHeroLayout>
  );
}

export default ProductHero;
