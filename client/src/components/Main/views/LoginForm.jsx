import React, { useState } from 'react';
import axios from 'axios';
import {
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Link,
  TextField,
  withStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import FindDialog from './FindDialog';

const styles = () => ({
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    fontWeight: 800,
    width: '100%',
  },
  imageSrc: {
    position: 'flex',
    backgroundSize: 'cover',
    backgroundPosition: 'inherit',
    width: '100%',
    height: '120px',
    margin: '10px',
    maxWidth: '120px',
    maxHeight: '130px',
    padding: '0',
  },
});

// TODO: 비밀번호 암호화하여 전달하기.
const LoginForm = (props) => {
  // prop를 통해 Marketer 인지 Creator인지 확인.
  // 데이터가 변경되는 것일 때 state로 처리를 한다.
  const {
    isMarketer, classes, handleClose, history, logout,
  } = props;
  const [open, setOpen] = useState(false);
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

  const formhandleClose = () => {
    setOpen(false);
    handleClose();
  };

  const twitchLogin = () => {
    axios.get('http://localhost:3000/login/twitch');
  };

  const login = (event) => {
    if (event) {
      event.preventDefault();
    }

    axios.post('/login',
      {
        userid,
        passwd,
      })
      .then((res) => {
        if (res.data) {
          console.log('로그인 완료');
          if (res.data.temporaryLogin) {
            history.push('/');
          } else {
            history.push('/dashboard/marketer/main', { userType: res.data.userType });
          }
        } else {
          alert('이메일 본인인증을 해야합니다.');
          logout();
        }
        handleClose();
      })
      .catch(() => {
        setPasswd(''); // 비밀번호 초기화
        alert('회원정보가 일치하지 않습니다.');
      });
  };

  const dialog = (isMarketer
    ? (
      <Dialog
        open={open}
        onClose={formhandleClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className={classes.title}>LOGIN</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontSize: 12 }}>
              온애드로 쉽고 빠르게!
          </DialogContentText>
          <form onChange={onChange}>
            <TextField
              autoFocus
              required
              label="ID"
              helperText="ID를 입력하세요."
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
          <Button
            component={Link}
            underline="always"
            style={{ fontSize: 10, marginTop: 10 }}
            onClick={() => {
              setDialogType('ID');
              setFindDialogOpen(true);
            }}
          >
            아이디가 기억나지 않으신가요?
          </Button>
          <br />
          <Button
            component={Link}
            underline="always"
            style={{ fontSize: 10, marginTop: 10 }}
            onClick={() => {
              setDialogType('PASSWORD');
              setFindDialogOpen(true);
            }}
          >
            비밀번호가 기억나지 않으신가요?
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
        onClose={formhandleClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className={classes.title}>LOGIN</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontSize: 12 }}>
        당신의 CHANNEL을 선택하세요.
          </DialogContentText>
          <Tooltip title="트위치 계정으로 로그인" placement="right">
            <Button
              component={Link}
              href="http://localhost:3000/login/twitch"
            // onClick ={twitchLogin}
              style={{
                backgroundImage: 'url("pngs/twitch3.png")',
              }}
              className={classes.imageSrc}
            >
              {''}
            </Button>
          </Tooltip>
        </DialogContent>
      </Dialog>
    )
  );


  return (
    <div>
      <Button color="inherit" onClick={() => { setOpen(true); }} className={classes.button}>
        {isMarketer ? '마케터' : '크리에이터'}
      </Button>
      {dialog}
      <FindDialog
        dialogType={dialogType}
        findDialogOpen={findDialogOpen}
        handleFindDialogClose={() => { setFindDialogOpen(false); }}
        handleClose={formhandleClose}
      />
    </div>
  );
};

LoginForm.defaultProps = {
  classes: {},
  isMarketer: true,
  logout: () => {},
  handleClose: () => {},
  history: {},
};

LoginForm.propTypes = {
  classes: PropTypes.object,
  isMarketer: PropTypes.bool,
  logout: PropTypes.func,
  handleClose: PropTypes.func,
  history: PropTypes.object,
};

export default withStyles(styles)(LoginForm);
