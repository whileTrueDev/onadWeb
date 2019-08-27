import React, { useState, useCallback } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import Grow from '@material-ui/core/Grow';
import axios from '../../../../utils/axios';
import Button from '../../components/Button';
import Typography from '../../components/Typography';
import ProductHeroLayout from './ProductHeroLayout';
import LoginForm from '../Login/LoginForm';
import HOST from '../../../../config';

const styles = makeStyles(theme => ({
  background: {
    backgroundColor: '#7fc7d9', // Average color of the background image.
    backgroundPosition: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 170,
    marginTop: 50,
  },
  loginButton: {
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
    borderWidth: 2,
  },
  loginButtonLeft: {
    [theme.breakpoints.up('sm')]: {
      marginRight: 10,
    },
    [theme.breakpoints.down('sm')]: {
      marginRight: 3,
      backgroundColor: theme.palette.primary.main,
    },
  },
  loginButtonRight: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: 10,
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: 3,
      backgroundColor: theme.palette.primary.main,
    },
  },
  loginButtonWrapper: {
    display: 'flex',
  },
  h3: {
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(8),
      width: 1024,
    },
    [theme.breakpoints.down('sm')]: {
      width: '210px',
      fontSize: 37,
    },
  },
  h3sub: {
    [theme.breakpoints.down('sm')]: {
      width: '300px',
      fontSize: 37,
    },
  },
  h5: {
    width: '250px',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      width: '500px',
      marginTop: theme.spacing(5),
    },
  },
  h6: {
    marginTop: theme.spacing(2),
    color: grey[500],
  },
  more: {
    marginTop: theme.spacing(2),
  },
}));

function useDialog() {
  const [open, setOpen] = useState(false);
  const [isMarketer, setIsMarketer] = useState();
  function handleOpen(buttonType) {
    setIsMarketer(buttonType === 'marketer');
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }
  return {
    open, isMarketer, handleOpen, handleClose,
  };
}

function ProductHero(props) {
  const {
    isLogin, history, source,
  } = props;

  const {
    open, isMarketer, handleOpen, handleClose,
  } = useDialog();
  const classes = styles();

  const handleClick = useCallback((buttonType) => {
    axios.get(`${HOST}/api/dashboard/checkUserType`)
      .then((res) => {
        const { userType } = res.data;
        if (userType === undefined) {
          if (buttonType) {
            handleOpen(buttonType);
          } else {
            // 로그인 이후 이용하세요
            alert('로그인 이후 이용하세요');
          }
        } else if (userType === 'marketer') {
          history.push('/dashboard/marketer/main');
        } else if (userType === 'creator') {
          history.push('/dashboard/creator/main');
        }
      }).catch((err) => {
        console.log(err);
      });
  }, [handleOpen, history]);

  return (
    <ProductHeroLayout
      backgroundClassName={classes.background}
      backgroundImage={source.backImage}
    >
      {/* Increase the network loading priority of the background image. */}
      <Grow in timeout={1500}>
        <Typography
          color="inherit"
          align="center"
          variant="h3"
          className={classes.h3}
        >
          {source.text.title}
        </Typography>
      </Grow>
      <Grow in timeout={1500}>
        <Typography
          className={classes.h3sub}
          color="inherit"
          align="center"
          variant="h3"
          marked="center"
          style={{ marginTop: 15 }}
        >
          {source.text.subTitle}
        </Typography>
      </Grow>
      <Grow in timeout={2500}>
        <Typography
          color="inherit"
          align="center"
          variant="subtitle2"
          className={classes.h5}
        >
          {source.text.body}
        </Typography>
      </Grow>
      {/* 로그인 / 대시보드로 이동 버튼 */}
      {isLogin ? (
        <Grow in timeout={2500}>
          <Button
            color="primary"
            variant="contained"
            size="large"
            className={classes.button}
            onClick={handleClick}
          >
          대시보드로 이동
          </Button>
        </Grow>
      ) : (

        <Grow in timeout={2500}>
          <div className={classes.loginButtonWrapper}>
            <Button
              color="primary"
              variant="outlined"
              className={
                classnames([classes.button], [classes.loginButton], [classes.loginButtonLeft])}
              onClick={() => handleClick('marketer')}
            >
              광고주로 로그인
            </Button>
            <Button
              color="primary"
              variant="outlined"
              className={
                classnames([classes.button], [classes.loginButton], [classes.loginButtonRight])}
              onClick={() => handleClick('creator')}
            >
              크리에이터 로그인
            </Button>
          </div>

        </Grow>

      )}

      {source.text.tail && (
        <Typography
          className={classes.h6}
          variant="subtitle2"
        >
          {source.text.tail}
        </Typography>
      )}

      <LoginForm
        open={open}
        isMarketer={isMarketer}
        history={history}
        handleClose={handleClose}
      />
    </ProductHeroLayout>
  );
}

export default ProductHero;
