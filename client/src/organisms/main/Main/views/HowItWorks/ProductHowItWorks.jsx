import React, { useState, useCallback } from 'react';
import shortid from 'shortid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import grey from '@material-ui/core/colors/grey';
import { Button } from '@material-ui/core';
import Typography from '../../components/Typography';
import LoginForm from '../Login/LoginForm';
import axios from '../../../../../utils/axios';
import HOST from '../../../../../utils/config';
import history from '../../../../../history';

const styles = theme => ({
  root: {
    display: 'flex',
    backgroundColor: grey[100],
    overflow: 'hidden',
  },
  root2: {
    display: 'flex',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  bottomSpace: {
    marginBottom: theme.spacing(12),
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
    marginTop: theme.spacing(12),
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
  titleLeft: {
    width: '40px',
    height: '60px',
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      width: '32px',
      height: '48px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '24px',
      height: '36px'
    },
    [theme.breakpoints.down('xs')]: {
      width: '18px',
      height: '27px',
    },
  },
  titleRight: {
    width: '40px',
    height: '60px',
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      width: '32px',
      height: '48px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '24px',
      height: '36px',
    },
    [theme.breakpoints.down('xs')]: {
      width: '18px',
      height: '27px',
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
  bottomButton: {
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
  plusLink: {
    background: 'linear-gradient(45deg, #FFAA00 30%, #FF8E53 90%)',
    color: 'white',
    fontSize: 20,
    height: 50,
    marginLeft: theme.spacing(4),
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.down('md')]: {
      fontSize: 18,
      height: 46,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
      height: 44,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
      height: 42,
    },
  },
  plusLink2: {
    background: 'linear-gradient(45deg, #00DBE0 30%, #21CBF3 90%)',
    color: 'white',
    fontSize: 20,
    height: 50,
    marginLeft: theme.spacing(4),
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.down('md')]: {
      fontSize: 18,
      height: 46,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
      height: 44,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
      height: 42,
    },
  },
  callImage: {
    width: 30,
    height: 55,
    marginLeft: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
      height: 44,
    },
  },
  callNumber: {
    color: '#00DBE0',
    marginLeft: theme.spacing(2),
    fontFamily: 'Noto Sans KR',
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
  bottomButtonDisplay: {
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    },
  }
});

const ProductHowItWorks = (props) => {
  const {
    classes, source, tabValue
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
    open, isMarketer, handleOpen, handleClose,
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
    <section className={source.content.location === 'mainpageLogin' ? (classes.root) : (classes.root2)}>
      <Container
        maxWidth="lg"
        component="section"
      >
        <div className={classes.mainBottom}>
          <img src="/pngs/main/mainBenefitTitleLeft.png" alt="middleTitleLeft" className={classes.titleLeft} />
          <Typography component="h2" style={{ fontFamily: 'Noto Sans Kr' }} className={classes.mainBottomtitle}>
            {source.content.title}
          </Typography>
          <img src="/pngs/main/mainBenefitTitleRight.png" alt="middleTitleRight" className={classes.titleRight} />
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

        <div className={classes.bottomButton}>
          { source.content.location !== 'mainpageLogin' ? (
            <div className={classes.bottomButtonDisplay}>
              <Button
                className={tabValue ? (classes.plusLink) : (classes.plusLink2)}
                onClick={tabValue ? (() => handleClick('creator')) : (() => handleClick('marketer'))}
              >
                <div style={{ fontFamily: 'Noto Sans Kr', fontWeight: '500' }}>바로 시작하기</div>
              </Button>

            </div>
          ) : (null) }


          <Button
            className={tabValue ? (classes.plusLink2) : (classes.plusLink)}
            onClick={() => { window.open('http://pf.kakao.com/_xoyxmfT/chat'); }}
          >
            <div style={{ fontFamily: 'Noto Sans Kr', fontWeight: '500' }}>플러스친구 문의</div>
          </Button>

          <img src="/pngs/main/call.png" alt="callimage" className={classes.callImage} />

          <Typography variant="h5" component="h2" className={classes.callNumber}>
            051-515-6309
          </Typography>
        </div>

        <Typography component="h2" className={classes.bottomSpace}>
            전화지원 및 플러스친구 답변은 월~금 (09:00~18:00)동안 운영됩니다.
        </Typography>
        <LoginForm
          open={open}
          isMarketer={isMarketer}
          history={history}
          handleClose={handleClose}
        />
      </Container>
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
