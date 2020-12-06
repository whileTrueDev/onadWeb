import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  TextField,
  Grid,
  Divider,
  Typography
} from '@material-ui/core';
import useStyles from '../style/LoginForm.style';
import axios from '../../../../utils/axios';
import FindDialog from './FindDialog';
import HOST from '../../../../config';
import history from '../../../../history';

interface Props {
  open: boolean;
  handleClose: () => void;
  logout?: () => void;
}
// TODO: 비밀번호 암호화하여 전달하기.
function LoginForm({
  open,
  handleClose,
}: Props): JSX.Element {
  // prop를 통해 Marketer 인지 Creator인지 확인.
  // 데이터가 변경되는 것일 때 state로 처리를 한다.
  const classes = useStyles();
  const [findDialogOpen, setFindDialogOpen] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<string>('ID');
  const [userid, setUserid] = useState<string>('');
  const [passwd, setPasswd] = useState<string>('');

  // 하나의 change로 값을 받을 수 있다.
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'userid') {
      setUserid(event.target.value);
    } else {
      setPasswd(event.target.value);
    }
  };

  const login = (event: React.SyntheticEvent) => {
    if (event) {
      event.preventDefault();
    }
    axios.post(`${HOST}/login`,
      { userid, passwd, type: 'marketer' })
      .then((res) => {
        if (res.data[0]) {
          setPasswd('');
          console.log(res.data);
          alert(res.data[1]);
          if (res.data[1] === '이메일 본인인증을 해야합니다.') {
            handleClose();
          }
        } else {
          const userData = res.data[1];
          if (userData.temporaryLogin) {
            handleClose();
            history.push('/');
          } else {
            // dispatch({ type: 'session', data: userData });
            handleClose();
            history.push('/mypage/marketer/main');
          }
        }
      })
      .catch((reason) => {
        console.log(reason);
        setPasswd(''); // 비밀번호 초기화
        alert('회원이 아닙니다.');
      });
  };

  const dialog = (
    // 마케터 로그인 창
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
    >
      <DialogContent>
        <DialogContentText style={{ fontSize: 15, fontFamily: 'Noto Sans kr' }}>
          온애드로 쉽고 빠르게!
        </DialogContentText>
        <form>
          <TextField
            autoFocus
            required
            label="ID"
            helperText="ID를 입력하세요."
            value={userid}
            margin="dense"
            name="userid"
            InputLabelProps={{ shrink: true }}
            style={{ width: '90%' }}
            onChange={onChange}
          />
          <TextField
            required
            label="PASSWORD"
            helperText="PASSWORD를 입력하세요"
            type="password"
            value={passwd}
            margin="dense"
            name="passwd"
            onChange={onChange}
            InputLabelProps={{ shrink: true }}
            style={{ width: '90%' }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                login(e);
              }
            }}
          />
        </form>
        <Typography style={{
          fontSize: 15, fontFamily: 'Noto Sans kr', marginTop: '20px', color: 'rgba(0, 0, 0, 0.54)', marginBottom: '3px'
        }}
        >
          소셜 계정으로 온애드 서비스 이용
        </Typography>
        <Divider component="hr" orientation="horizontal" />
        <Grid container direction="row" alignItems="flex-end">
          <Grid item>
            <Button href={`${HOST}/login/google`}>
              <img src="/pngs/logo/google.png" alt="google" className={classes.image} />
            </Button>
          </Grid>
          <Grid item>
            <Button href={`${HOST}/login/naver`}>
              <img src="/pngs/logo/naver2.png" alt="naver" className={classes.image} />
            </Button>
          </Grid>
          <Grid item>
            <Button href={`${HOST}/login/kakao`}>
              <img src="/pngs/logo/kakao.png" alt="kakao" className={classes.image} />
            </Button>
          </Grid>
        </Grid>
        <Button
          style={{ fontSize: 11, marginTop: 10 }}
          onClick={() => {
            setDialogType('ID');
            setFindDialogOpen(true);
          }}
        >
          아이디가 기억나지 않으신가요?
        </Button>
        <br />
        <Button
          style={{ fontSize: 11, marginTop: 10 }}
          onClick={() => {
            setDialogType('PASSWORD');
            setFindDialogOpen(true);
          }}
        >
          비밀번호가 기억나지 않으신가요?
        </Button>
        <br />
        <Button
          component={Link}
          style={{ fontSize: 11, marginTop: 10 }}
          to="/regist"
        >
          계정이 없으신가요? 회원가입하기
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={login} color="primary">
          로그인
        </Button>
        <Button onClick={handleClose} color="primary">
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <div>
      {dialog}
      <FindDialog
        dialogType={dialogType}
        findDialogOpen={findDialogOpen}
        handleFindDialogClose={() => { setFindDialogOpen(false); }}
        handleClose={handleClose}
      />
    </div>
  );
}

export default LoginForm;
