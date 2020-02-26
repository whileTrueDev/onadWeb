import React, { useState, useCallback } from 'react';
import shortid from 'shortid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Hidden } from '@material-ui/core';
import Typography from '../../components/Typography';
import LoginForm from '../Login/LoginForm';
import axios from '../../../../../utils/axios';
import HOST from '../../../../../utils/config';
import history from '../../../../../history';

const styles = theme => ({
  root: {
    backgroundColor: 'white',
    marginBottom: theme.spacing(8),
    padding: '80px 0px',
    [theme.breakpoints.down('sm')]: {
      padding: '4px 0px',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '30px 0px',
    },
  },
  bottomSpace: {
    marginBottom: theme.spacing(8),
    marginTop: 12,
    fontFamily: 'Noto Sans KR',
    fontSize: 22,
    [theme.breakpoints.down('md')]: {
      fontSize: 20,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 18,
      wordBreak: 'keep-all',
      textAlign: 'center',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
      wordBreak: 'keep-all',
      textAlign: 'center',
    },
  },
  mainBottom: {
    display: 'flex',
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(10),
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(8),
      justifyContent: 'center'
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(6),
      justifyContent: 'center'
    },
  },
  mainBottomtitle: {
    fontSize: 48,
    fontFamily: 'Noto Sans Kr',
    fontWeight: 600,
    [theme.breakpoints.down('md')]: {
      fontSize: 40,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 30,
      wordBreak: 'keep-all',
      textAlign: 'center'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 20,
      wordBreak: 'keep-all',
      textAlign: 'center'
    },
  },
  bottomText: {
    fontFamily: 'Noto Sans KR',
    fontSize: 22,
    [theme.breakpoints.down('md')]: {
      fontSize: 20,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 18,
      wordBreak: 'keep-all',
      textAlign: 'center',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
      wordBreak: 'keep-all',
      textAlign: 'center',
    },
  },
  bottomButtom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'left',
    alignItems: 'center',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    },
  },
  mainBottomImg: {
    width: '650px',
    height: '440px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    wordBreak: 'keep-all',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 200,
    height: 60,
    fontSize: 20,
    fontFamily: 'Noto sans KR',
    fontWeight: 500,
    color: 'white',
    margin: 20,
    borderRadius: 5,
    wordBreak: 'keep-all',
    backgroundColor: '#3154EB',
    [theme.breakpoints.down('md')]: {
      width: 190,
      fontSize: 18,
    },
    [theme.breakpoints.down('sm')]: {
      width: 180,
      fontSize: 18,
    },
    [theme.breakpoints.down('sm')]: {
      margin: 10,
      width: 140,
      fontSize: 14,
    },
  }
});

const ProductHowItWorks = (props) => {
  const {
    classes, source, MainUserType
  } = props;

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

  const {
    open, isMarketer, handleOpen, handleClose
  } = useDialog();

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
    <section className={classes.root}>
      <div className={classes.wrapper}>
        <Hidden mdDown>
          <div style={{ marginRight: '80px' }}>
            <img src="/pngs/main/mainBottomImage.PNG" className={classes.mainBottomImg} alt="mainBottomImage" />
          </div>
        </Hidden>
        <div>
          <div className={classes.mainBottom}>
            <Typography component="h2" className={classes.mainBottomtitle}>
              {source.content.title}
            </Typography>
          </div>
          <div>
            {source.content.text.split('\n').map(row => (
              <Typography
                key={shortid.generate()}
                component="h2"
                style={{ marginTop: 12, marginBottom: 12, fontFamily: 'Noto Sans Kr' }}
                className={classes.bottomText}
              >
                {`${row}`}
              </Typography>
            ))}
          </div>
          <div className={classes.bottomButtom}>
            <Button
              className={classes.button}
              onClick={MainUserType === 'marketer' ? (() => handleClick('marketer')) : (() => { handleClick('creator'); })}
            >
              바로 시작하기
            </Button>

            <Button
              className={classes.button}
              onClick={() => { window.open('http://pf.kakao.com/_xoyxmfT/chat'); }}
            >
              플러스친구 문의
            </Button>

          </div>
          <Typography component="h2" className={classes.bottomSpace}>
              전화지원 및 플러스친구 답변은 월~금 (10:00~19:00)동안 운영됩니다.
          </Typography>
        </div>
        <LoginForm
          open={open}
          isMarketer={isMarketer}
          history={history}
          handleClose={handleClose}
        />
      </div>
    </section>
  );
};


ProductHowItWorks.propTypes = {
  classes: PropTypes.object,
};

ProductHowItWorks.defaultProps = {
  classes: {},
};

export default withStyles(styles)(ProductHowItWorks);
