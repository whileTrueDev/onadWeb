import React from 'react';
import Button from '@material-ui/core/Button';
import ProductHeroLayout from './ProductHeroLayout';
import styles from '../style/ProductHero.style';
import { Typography } from '@material-ui/core';
import LoginForm from '../login/LoginForm';

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
  logout: () => void
}

function ProductHero({ MainUserType, source, isLogin, logout }: ProductHeroProps): JSX.Element {
  const classes = styles();

  const [loginValue, setLoginValue] = React.useState('');

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
            <Typography align="center" variant="h2" className={classes.mainTitle}>
              {source.text.title}
            </Typography>
            <Typography align="center" variant="h2" className={classes.mainTitle}>
              <span>{source.text.beforeSubTitle}</span>
              <span>{source.text.subTitle}</span>
            </Typography>

          <Button 
            className={classes.loginButton}
            onClick={() => handleDialogOpenClick('marketer')}
          >
            온애드 시작하기
          </Button>
        </div>
      )
      : (
        // 크리에이터 페이지
        <div className={classes.root}>
            <Typography align="center" variant="h2" className={classes.mainTitle}>
              {source.textCreator.title}
            </Typography>
            <Typography align="center" variant="h2" className={classes.mainTitle}>
              <span>{source.textCreator.subTitle}</span>
            </Typography>

          <Button
            className={classes.loginButton2}
            onClick={() => handleDialogOpenClick('creator')}
          >
            온애드 시작하기
          </Button>
        </div>
      )}
      <LoginForm
        open={loginValue === 'marketer'}
        isMarketer
        handleClose={handleDialogClose}
        logout={logout}
      />
      <LoginForm
        open={loginValue === 'creator'}
        isMarketer={false}
        handleClose={handleDialogClose}
        logout={logout}
      />
    </ProductHeroLayout>
  );
}

export default ProductHero;
