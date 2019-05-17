import React, { useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  withStyles,
} from '@material-ui/core';

const style = theme => ({
  contents: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    margin: 10,
  },
  contentText: {
    fontSize: 13,
  },
  textfield: {
    width: 500,
  },
});

const RePasswordDialog = (props) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const checkPasswd = (event) => {
    event.preventDefault();
    const regx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
    if (regx.test(event.target.value)) {
      setError(null);
      setPassword(event.target.value);
    } else {
      setError('password');
      setMessage('특수문자를 포함한 8-20자 영문,숫자 조합');
    }
  };

  const checkRePasswd = (event) => {
    event.preventDefault();
    if (event.target.value === password) {
      setError(null);
    } else {
      setError('repasswd');
      setMessage('비밀번호와 동일하지 않습니다.');
    }
  };

  const handleSubmit = (event) => {
    const { history, setRepassword, logout } = props;
    event.preventDefault();
    if (error) {
      alert('입력이 올바르지 않습니다.');
      return;
    }
    const user = {
      password: event.target.password.value,
    };

    axios.post('/login/changePw', user)
      .then((res) => {
        alert('비밀번호 변경이 완료되었습니다. 다시 로그인 해주세요');
        setRepassword(false);
        logout();
        history.replace('/');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const { repasswordOpen, classes } = props;


  return (
    <Dialog
      open={repasswordOpen}
      maxWidth="xl"
      disableBackdropClick={false}
    >
      <DialogTitle>CHANGE PW</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className={classes.contents}>
          <DialogContentText className={classes.contentText}>
        변경할 비밀번호를 입력하세요.
          </DialogContentText>
          <TextField
            required
            label="PASSWORD"
            type="password"
            name="password"
            placeholder="비밀번호를 입력하세요."
            onChange={checkPasswd}
            helperText={error === 'password' ? message : ' '}
            error={error === 'password'}
            margin="dense"
            autoFocus
            className={classes.textfield}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            required
            type="password"
            label="RE-PASSWORD"
            placeholder="비밀번호를 재입력하세요."
            helperText={error === 'repasswd' ? message : ' '}
            error={error === 'repasswd'}
            onChange={checkRePasswd}
            margin="dense"
            className={classes.textfield}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit" value="Submit" color="primary">확인</Button>
          <Button color="primary">취소</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};


export default withStyles(style)(RePasswordDialog);
