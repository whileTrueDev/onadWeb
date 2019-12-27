import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '../../../../atoms/CustomButtons/Button';

const useStyles = makeStyles(theme => ({
  container: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
    backgroundColor: '#f2f2f2',
    fontSize: 20,
  },
  contents: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
    backgroundColor: '#F8ADAD',
    fontSize: 20,
  },
}));
const SignOutDialog = (props) => {
  const {
    handleOpen, open, marketerId, signOutFunc
  } = props;
  const classes = useStyles();
  return (
    <Dialog onClose={handleOpen} open={open}>
      <Paper>
        <div className={classes.container}>
          <p>회원탈퇴를 하시면, 아래 정보들이 삭제됩니다.</p>
          <p>
            또한 해당 아이디
            {' '}
            (
            <span style={{ color: 'red' }}>
              {marketerId}
            </span>
            )
            {' '}
          로 본인 또는 타인의 재가입이 불가능합니다.
          </p>
        </div>
        <Typography className={classes.contents}>
          <p>이름, 비밀번호, 메일, 전화번호, 사업자 등록번호, 계좌정보,</p>
          <p>사업자 등록증 이미지, 개인식별자, 등록한 배너, 등록한 캠페인, 충전된 캐시</p>
        </Typography>
        <Button color="info" onClick={handleOpen}>
          환불하기
        </Button>
        <Button color="danger" onClick={() => signOutFunc()}>
          탈퇴하기
        </Button>
      </Paper>
    </Dialog>
  );
};

export default SignOutDialog;
