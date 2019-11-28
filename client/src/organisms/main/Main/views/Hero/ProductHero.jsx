import React, { useState, useCallback } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Grow from '@material-ui/core/Grow';
import axios from '../../../../../utils/axios';
import Button from '../../components/Button';
import Typography from '../../components/Typography';
import ProductHeroLayout from './ProductHeroLayout';
import LoginForm from '../Login/LoginForm';
import HOST from '../../../../../utils/config';
import history from '../../../../../history';

const styles = makeStyles(theme => ({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 50,
    fontFamily: 'Noto Sans KR',
  },
  loginButtonMarketer: {
    background: 'linear-gradient(45deg, #00DBE0 30%, #21CBF3 90%)',
    borderWidth: 2,
    color: 'white',
    fontSize: '18px',
    fontWeight: '600',
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.down('md')]: {
      fontSize: '14px',
    },
  },
  loginButtonCreator: {
    background: 'linear-gradient(45deg, #FFAA00 30%, #FF8E53 90%)',
    borderWidth: 2,
    color: 'white',
    fontSize: '18px',
    fontWeight: '600',
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.down('md')]: {
      fontSize: '14px',
    },
  },
  loginButtonLeft: {
    color: 'black',
    marginRight: 10,
    textAlign: 'left',
    width: '22%',
    fontSize: '18px',
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.down('md')]: {
      color: 'black',
      marginRight: 10,
      textAlign: 'left',
      width: '23%',
      fontSize: '15px',
      fontFamily: 'Noto Sans KR',
    },
    [theme.breakpoints.down('sm')]: {
      color: 'black',
      marginRight: 10,
      textAlign: 'center',
      width: '80%',
      fontFamily: 'Noto Sans KR',
      gridColumn: '1/3',
      gridRow: '2',
      margin: 'auto',
      fontSize: '13px',
    },
    [theme.breakpoints.down('xs')]: {
      color: 'black',
      marginRight: 20,
      textAlign: 'center',
      width: '70%',
      fontFamily: 'Noto Sans KR',
      gridColumn: '1/3',
      gridRow: '2',
      margin: 'auto',
      fontSize: '11px',
    },
  },
  loginButtonLeftLogined: {
    color: 'black',
    marginRight: 20,
    textAlign: 'center',
    width: '27%',
    fontSize: '20px',
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.down('md')]: {
      color: 'black',
      marginRight: 20,
      textAlign: 'center',
      width: '28%',
      fontSize: '15px',
      fontFamily: 'Noto Sans KR',
    },
    [theme.breakpoints.down('sm')]: {
      color: 'black',
      textAlign: 'center',
      width: '80%',
      fontFamily: 'Noto Sans KR',
      gridColumn: '2/4',
      gridRow: '2',
      margin: 'auto',
      fontSize: '14px',
    },
    [theme.breakpoints.down('xs')]: {
      color: 'black',
      textAlign: 'center',
      width: '70%',
      fontFamily: 'Noto Sans KR',
      gridColumn: '2/4',
      gridRow: '2',
      margin: 'auto',
      fontSize: '11px',
    },
  },
  loginButtonRight: {
    color: 'black',
    marginLeft: 10,
    textAlign: 'right',
    width: '22%',
    fontSize: '18px',
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.down('md')]: {
      color: 'black',
      marginLeft: 10,
      textAlign: 'right',
      width: '23%',
      fontSize: '15px',
      fontFamily: 'Noto Sans KR',
    },
    [theme.breakpoints.down('sm')]: {
      color: 'black',
      marginLeft: 10,
      textAlign: 'center',
      width: '80%',
      fontFamily: 'Noto Sans KR',
      gridColumn: '3/5',
      gridRow: '2',
      margin: 'auto',
      fontSize: '13px',
    },
    [theme.breakpoints.down('xs')]: {
      color: 'black',
      marginLeft: 20,
      textAlign: 'center',
      width: '70%',
      fontFamily: 'Noto Sans KR',
      gridColumn: '3/5',
      gridRow: '2',
      margin: 'auto',
      fontSize: '11px',
    },

  },
  loginButtonRightLogined: {
    color: 'black',
    marginLeft: 20,
    textAlign: 'center',
    width: '27%',
    fontSize: '20px',
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.down('md')]: {
      color: 'black',
      marginLeft: 20,
      textAlign: 'center',
      width: '28%',
      fontSize: '15px',
      fontFamily: 'Noto Sans KR',
    },
    [theme.breakpoints.down('sm')]: {
      color: 'black',
      textAlign: 'center',
      width: '80%',
      fontFamily: 'Noto Sans KR',
      gridColumn: '2/4',
      gridRow: '2',
      margin: 'auto',
      fontSize: '14px',
    },
    [theme.breakpoints.down('xs')]: {
      color: 'black',
      textAlign: 'center',
      width: '70%',
      fontFamily: 'Noto Sans KR',
      gridColumn: '2/4',
      gridRow: '2',
      margin: 'auto',
      fontSize: '11px',
    },
  },
  h3: {
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(8),
      width: 1024,
      color: 'black',
      fontSize: 37,
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(8),
      width: 800,
      color: 'black',
      fontSize: 30,
      wordBreak: 'keep-all'
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(8),
      width: '320px',
      fontSize: 25,
      wordBreak: 'keep-all'
    },
  },
  h3sub: {
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(8),
      width: 960,
      color: 'black',
      fontSize: 37,
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(8),
      width: 600,
      color: 'black',
      fontSize: 30,
      wordBreak: 'keep-all'
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(8),
      width: 320,
      fontSize: 23,
      wordBreak: 'keep-all'
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
  // more: {
  //   marginTop: theme.spacing(2),
  // },
  mainbarImg: {
    backgroundImage: 'url(/pngs/main/mainbar.png)',
    width: '80px',
    height: '35px',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: '60px',
      height: '28px',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      margin: 'auto',
      backgroundSize: 'cover'
    },

  },
  maintop: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 120px)',
      gridTemplateRows: 'repeat(2, 270px)'
    },
    [theme.breakpoints.down('xs')]: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 110px)',
      gridTemplateRows: 'repeat(2, 250px)'
    },
  },
  maintopCenterImg: {
    backgroundImage: 'url(/pngs/main/mainImage.png)',
    backgroundSize: 'cover',
    [theme.breakpoints.up('lg')]: {
      width: '700px',
      height: '400px',
    },
    [theme.breakpoints.down('md')]: {
      width: '500px',
      height: '280px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '400px',
      height: '240px',
      gridColumn: '1/5',
      gridRow: '1',
      margin: 'auto'
    },
    [theme.breakpoints.down('xs')]: {
      width: '280px',
      height: '160px',
      gridColumn: '1/5',
      gridRow: '1',
      margin: 'auto'
    },
  },
  maintopmarketerText: {
    display: 'block',
    color: '#00DBE0',
    fontSize: '25px',
    fontWeight: '700',
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.down('md')]: {
      fontSize: '23px',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '15px',
    },
  },
  maintopcreatorText: {
    display: 'block',
    color: '#FFAA00',
    fontSize: '25px',
    fontWeight: '700',
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.down('md')]: {
      fontSize: '23px',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '15px',
    },
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
    isLogin, source, userType
  } = props;

  const {
    open, isMarketer, handleOpen, handleClose
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
  }, [handleOpen]);

  return (
    <ProductHeroLayout>
      <Grow in timeout={1500}>
        <Typography
          // color="inherit"
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
          // color="inherit"
          align="center"
          variant="h3"
          style={{ marginTop: 15 }}
        >
          {source.text.subTitle}
          <div
            className={classes.mainbarImg}
          />
        </Typography>
      </Grow>

      {/* 로그인 / 대시보드로 이동 버튼 */}
      {isLogin ? (
        <Grow in timeout={2500}>
          <div className={classes.maintop}>
            { userType === 'marketer' ? (
              <>
                <div className={classes.loginButtonLeftLogined}>
                  <div className={classes.maintopmarketerText}>{source.text.marketer}</div>
                  <div>
                    {source.text.marketerTail.split('\n').map(row => (
                      <p key={row}>{`${row}`}</p>
                    ))}
                  </div>
                  <Button
                    className={
                    classnames([classes.button], [classes.loginButtonMarketer])}
                    onClick={() => handleClick('marketer')}
                  >
                  대시보드로 이동
                  </Button>
                </div>

                <div className={classes.maintopCenterImg} />
              </>
            ) : (
              <>
                <div className={classes.maintopCenterImg} />
                <div className={classes.loginButtonRightLogined}>
                  <div className={classes.maintopcreatorText}>{source.text.creator}</div>
                  <div>
                    {source.text.creatorTail.split('\n').map(row => (
                      <p key={row}>{`${row}`}</p>
                    ))}
                  </div>
                  <Button
                    className={
                    classnames([classes.button], [classes.loginButtonCreator])}
                    onClick={() => handleClick('creator')}
                  >
                  대시보드로 이동
                  </Button>
                </div>
              </>
            )}
          </div>
        </Grow>
      ) : (

        <Grow in timeout={2500}>
          <div className={classes.maintop}>

            <div className={classes.loginButtonLeft}>
              <div className={classes.maintopmarketerText}>{source.text.marketer}</div>
              <div>
                {source.text.marketerTail.split('\n').map(row => (
                  <p key={row}>{`${row}`}</p>
                ))}
              </div>
              <Button
                className={
                  classnames([classes.button], [classes.loginButtonMarketer])}
                onClick={() => handleClick('marketer')}
              >
                + 자세히보기
              </Button>
            </div>

            <div className={classes.maintopCenterImg} />

            <div className={classes.loginButtonRight}>
              <div className={classes.maintopcreatorText}>{source.text.creator}</div>
              <div>
                {source.text.creatorTail.split('\n').map(row => (
                  <p key={row}>{`${row}`}</p>
                ))}
              </div>
              <Button
                className={
                  classnames([classes.button], [classes.loginButtonCreator])}
                onClick={() => handleClick('creator')}
              >
                + 자세히보기
              </Button>
            </div>

          </div>
        </Grow>

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
