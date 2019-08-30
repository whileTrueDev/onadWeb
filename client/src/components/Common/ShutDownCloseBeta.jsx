import React from 'react';
import { Link } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#fff',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: theme.spacing(10),
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
  },
  linkButton1: {
    padding: 10,
    color: '#fff',
    maxWidth: '250px',
    height: '80px',
    textTransform: 'none',
    marginLeft: 10,
    backgroundColor: '#48d9cc',
    '&:hover': {
      backgroundColor: '#48b1cc',
    }
  },
  linkButton2: {
    padding: 10,
    color: '#fff',
    maxWidth: '250px',
    height: '80px',
    textTransform: 'none',
    marginLeft: 10,
    backgroundColor: '#ffa60f',
    '&:hover': {
      backgroundColor: '#dfa11f',
    }
  },
}));

export default function ShutDownCloseBeta() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.container}>

        <img src="/pngs/logo/onad_logo.png" alt="logo" />

        <h2>방문해주셔서 감사합니다.</h2>
        <span>2019년 10월 중, 2차 클로즈베타로 다시 찾아뵙겠습니다. </span>
        <span>
          <strong>1차 클로즈베타 테스터분들은</strong>
          {' '}
          아래의 링크를 통해
          {' '}
          <strong>설문</strong>
        을 진행하여 주세요.
        </span>
        <span>
          <strong>2차 클로즈베타를 참여할 의사가 있는 분들은</strong>
          {' '}
          아래의
          {' '}
          <strong>링크를 통해 신청</strong>
          해주세요.
        </span>
        <span>문의가 필요하시다면, support@onad.io 로 메일을 보내주세요! 빠른 시일내에 답변드릴게요.</span>
        <br />

        <div>
          <Button
            className={classes.linkButton1}
            size="large"
            onClick={() => { window.open('https://forms.gle/BTXTpvEpQJWfgPDz5'); }}
          >
            1차 클로즈베타 설문하기
          </Button>
          <Button
            className={classes.linkButton2}
            size="large"
            to="/"
            component={Link}
          >
            2차 클로즈베타 신청하기
          </Button>
        </div>
      </div>

    </div>
  );
}
