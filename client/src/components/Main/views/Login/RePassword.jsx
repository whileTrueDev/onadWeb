import React, { useState, useReducer } from 'react';
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
import axios from '../../../../utils/axios';
import HOST from '../../../../config';

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

const initialValue = {
  value: '',
  password: false,
  repasswd: false,
};

// reducer를 사용하여 Error를 handling하자
const myReducer = (state, action) => {
  switch (action.type) {
    case 'password': {
      const regx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
      if (regx.test(action.value)) {
        console.log('비밀번호가 형식과 일치합니다.');
        return { ...state, value: action.value, password: false };
      }
      return { ...state, value: action.value, password: true };
    }
    case 'repasswd': {
      if (state.value === action.value) {
        return { ...state, repasswd: false };
      }
      return { ...state, repasswd: true };
    }
    default: {
      return state;
    }
  }
};

const RePasswordDialog = (props) => {
  const [state, dispatch] = useReducer(myReducer, initialValue);

  const checkPasswd = (event) => {
    event.preventDefault();
    dispatch({ type: 'password', value: event.target.value });
  };

  const checkRePasswd = (event) => {
    event.preventDefault();
    dispatch({ type: 'repasswd', value: event.target.value });
  };

  const handleSubmit = (event) => {
    const { history, setRepassword, logout } = props;
    event.preventDefault();
    if (state.password || state.repasswd) {
      alert('입력이 올바르지 않습니다.');
      return;
    }
    const user = {
      password: event.target.password.value,
    };

    axios.post(`${HOST}/api/login/changePw`, user)
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
            id="password"
            placeholder="비밀번호를 입력하세요."
            onChange={checkPasswd}
            helperText={state.password ? '특수문자를 포함한 영문/숫자 혼합 8자리 이상입니다.' : ' '}
            error={state.password}
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
            helperText={state.repasswd ? '비밀번호와 동일하지 않습니다.' : ' '}
            error={state.repasswd}
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
