import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Grid,
  Divider,
  Typography
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import axios from '../../../../utils/axios';
import FindDialog from './FindDialog';
import HOST from '../../../../config';
import history from '../../../../history';


const useStyles = makeStyles(() => ({
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontFamily: 'Noto Sans KR',
    fontWeight: 600
  },
  button: {
    fontWeight: 800,
    width: '100%',
    fontFamily: 'Noto Sans KR',
  },
  image: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    objectPosition: 'top',
    borderRadius: '50%'
  },
  imageSrc: {
    display: 'flex',
    backgroundSize: 'cover',
    backgroundPosition: 'inherit',
    width: '150px',
    height: '120px',
    maxWidth: '160px',
    maxHeight: '130px',
    margin: '0 auto',
  },
}));

interface Props {
  open: boolean;
  isMarketer: boolean | undefined;
  handleClose: () => void;
  logout: function;
}
// TODO: 비밀번호 암호화하여 전달하기.
function LoginForm({
  open = false,
  isMarketer = true,
  handleClose = () => { },
  logout = () => { }
}): JSX.Element {
  // prop를 통해 Marketer 인지 Creator인지 확인.
  // 데이터가 변경되는 것일 때 state로 처리를 한다.
  const [findDialogOpen, setFindDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('ID');
  const [userid, setUserid] = useState('');
  const [passwd, setPasswd] = useState('');

  // 하나의 change로 값을 받을 수 있다.
  const onChange = (event) => {
    if (event.target.name === 'userid') {
      setUserid(event.target.value);
    } else {
      setPasswd(event.target.value);
    }
  };

  const login = (event) => {
    if (event) {
      event.preventDefault();
    }
    axios.post(`${HOST}/api/login`,
      {
        userid,
        passwd,
      })
      .then((res) => {
        if (res.data[0]) {
          setPasswd('');
          alert(res.data[1]);
          if (res.data[1] === '이메일 본인인증을 해야합니다.') {
            handleClose();
            logout();
          }
        } else {
          const userData = res.data[1];
          if (userData.temporaryLogin) {
            handleClose();
            history.push('/');
          } else {
            // dispatch({ type: 'session', data: userData });
            handleClose();
            history.push('/dashboard/marketer/main');
          }
        }
      })
      .catch((reason) => {
        console.log(reason);
        setPasswd(''); // 비밀번호 초기화
        alert('회원이 아닙니다.');
      });
  };

  const dialog = (isMarketer
    ? (
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
      >
        <DialogTitle className={classes.title}>LOGIN</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontSize: 15, fontFamily: 'Noto Sans kr' }}>
            온애드로 쉽고 빠르게!
          </DialogContentText>
          <form onChange={onChange}>
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
            />
            <TextField
              required
              label="PASSWORD"
              helperText="PASSWORD를 입력하세요"
              type="password"
              value={passwd}
              margin="dense"
              name="passwd"
              InputLabelProps={{ shrink: true }}
              style={{ width: '90%' }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  login();
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
          <Divider component="hr" orientation="horizontal" width="60%" />
          <Grid container direction="row" align="right">
            <Grid item>
              <Button href={`${HOST}/api/login/google`}>
                <img src="/pngs/logo/google.png" alt="google" className={classes.image} />
              </Button>
            </Grid>
            <Grid item>
              <Button href={`${HOST}/api/login/naver`}>
                <img src="/pngs/logo/naver2.png" alt="naver" className={classes.image} />
              </Button>
            </Grid>
            <Grid item>
              <Button href={`${HOST}/api/login/kakao`}>
                <img src="/pngs/logo/kakao.png" alt="kakao" className={classes.image} />
              </Button>
            </Grid>
          </Grid>
          {/* <Grid container direction="column" style={{ marginTop: '20px' }}>
            <Grid item>
              <Button href={`${HOST}/api/login/google`} className={classes.loginButtion}>
                <img src="pngs/main/google.png" alt="google" className={classes.image} />
              </Button>
            </Grid>
            <Grid item>
              <Button href={`${HOST}/api/login/naver`} className={classes.loginButtion}>
                <img src="pngs/main/naver.png" alt="naver" className={classes.image} />
              </Button>
            </Grid>
            <Grid item>
              <Button href={`${HOST}/api/login/kakao`} className={classes.loginButtion}>
                <img src="pngs/main/kakao.png" alt="kakao" className={classes.image} />
              </Button>
            </Grid>
          </Grid> */}
          <Button
            underline="always"
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
            underline="always"
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
            underline="always"
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
    )
    : (
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className={classes.title}>LOGIN</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontSize: 15, fontFamily: 'Noto Sans kr' }}>
            당신의 CHANNEL을 선택하세요.
          </DialogContentText>
          <Tooltip title="트위치 계정으로 로그인" placement="right">
            <Button
              href={`${HOST}/api/login/twitch`}
              style={{
                backgroundImage: 'url("/pngs/logo/twitch.png")',
              }}
              className={classes.imageSrc}
            />
          </Tooltip>
        </DialogContent>
      </Dialog>
    )
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

LoginForm.defaultProps = {
  classes: {},
  isMarketer: true,
  logout: () => { },
  handleClose: () => { },
};

export default LoginForm;
