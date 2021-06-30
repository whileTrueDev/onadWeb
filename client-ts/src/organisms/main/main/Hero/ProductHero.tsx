import { useState, useMemo } from 'react';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import ProductHeroLayout from './ProductHeroLayout';
import styles from '../style/ProductHero.style';
import CreatorLoginForm from '../login/CreatorLoginForm';
import MarketerLoginForm from '../login/MarketerLoginForm';
import { useAuthStore } from '../../../../store/authStore';

interface ProductHeroProps {
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
}

function ProductHero({ source }: ProductHeroProps): JSX.Element {
  const { pathname } = useLocation();
  const isMarketerPage = useMemo(() => pathname.includes('/marketer'), [pathname]);
  const isLogin = useAuthStore(state => state.isLoggedIn);
  const logout = useAuthStore(state => state.logout);
  const classes = styles();

  const [loginValue, setLoginValue] = useState('');

  function handleDialogOpenClick(newValue: string): void {
    setLoginValue(newValue);
  }

  function handleDialogClose(): void {
    setLoginValue('');
  }

  return (
    <ProductHeroLayout isMarketerPage={isMarketerPage}>
      {isMarketerPage ? (
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
      <MarketerLoginForm open={loginValue === 'marketer'} handleClose={handleDialogClose} />
      <CreatorLoginForm open={loginValue === 'creator'} handleClose={handleDialogClose} />
    </ProductHeroLayout>
  );
}

export default ProductHero;
