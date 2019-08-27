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
    marginTop: theme.spacing(20),
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
  },
  linkButton: {
    color: '#fff',
    maxWidth: '250px',
    height: '80px',
    textTransform: 'none',
    backgroundColor: '#00b1dc',
    '&:hover': {
      backgroundColor: '#00a1dc',
    },
  },
}));

export default function NotFound() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.container}>

        <img src="/pngs/logo/onad_logo.png" alt="logo" />

        <h1>페이지를 찾을 수 없습니다.</h1>
        <span>방문을 원하시는 페이지의 주소가 잘못되었거나</span>
        <span>혹은 오류 및 변경, 삭제로 인해 요청하신 페이지를 찾을 수 없습니다.</span>
        <span>문의가 필요하시다면, support@onad.io 로 메일을 보내주세요! 빠른 시일내에 답변드릴게요.</span>
        <br />
        <Button className={classes.linkButton} size="large" to="/" component={Link}>OnAD 메인으로 이동</Button>
      </div>
    </div>
  );
}
