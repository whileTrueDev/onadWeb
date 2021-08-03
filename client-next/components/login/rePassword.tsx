import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from '@material-ui/core';
// 내부 소스

// 프로젝트 내부 모듈
import { useReducer } from 'react';
import * as React from 'react';
import { useRouter } from 'next/router';
// 컴포넌트
// util 계열
import passwordRegex from '../../utils/inputs/regex/password.regex';
import { useMarketerUpdateMarketerInfoMutation } from '../../utils/hooks/mutation/useMarketerUpdateMarketerInfoMutation';
// 스타일
import useStyles from '../../styles/login/rePassword.style';

const initialValue = {
  value: '',
  password: false,
  repasswd: false,
};

interface RepasswordState {
  password: boolean;
  repasswd: boolean;
  value: string;
}

type RepasswordAction = { type: 'password'; value: string } | { type: 'repasswd'; value: string };

// reducer를 사용하여 Error를 handling하자
const myReducer = (state: RepasswordState, action: RepasswordAction) => {
  switch (action.type) {
    case 'password': {
      if (passwordRegex.test(action.value)) {
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

type InputType = React.ChangeEvent<HTMLInputElement>;
type FormType = React.FormEvent<HTMLFormElement>;
interface Props {
  setRepassword: any;
  logout: () => void;
  repasswordOpen: boolean;
}

function RePasswordDialog({ setRepassword, logout, repasswordOpen }: Props): JSX.Element {
  const [state, dispatch] = useReducer(myReducer, initialValue);
  const classes = useStyles();
  const router = useRouter();

  const checkPasswd = (event: InputType) => {
    event.preventDefault();
    dispatch({ type: 'password', value: event.target.value });
  };

  const checkRePasswd = (event: InputType) => {
    event.preventDefault();
    dispatch({ type: 'repasswd', value: event.target.value });
  };

  const updateMarketerMutation = useMarketerUpdateMarketerInfoMutation();

  const handleSubmit = (event: FormType) => {
    event.preventDefault();
    if (state.password || state.repasswd) {
      alert('입력이 올바르지 않습니다.');
      return;
    }

    updateMarketerMutation
      .mutateAsync({
        type: 'password',
        value: state.value,
      })
      .then(() => {
        alert('비밀번호 변경이 완료되었습니다. 다시 로그인 해주세요');
        setRepassword(false);
        logout();
        router.replace('/');
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <Dialog open={repasswordOpen} maxWidth="xl">
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
            helperText={state.password ? '특수문자 !@#$%^*+=- 를 포함한 8-20 영문 또는 숫자' : ' '}
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
          <Button type="submit" value="Submit" color="primary">
            확인
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default RePasswordDialog;
