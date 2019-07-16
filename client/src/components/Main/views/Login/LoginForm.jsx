import React, { useState, useContext } from 'react';
import axios from '../../../../../utils/axios';
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
import { StateContext } from '../../../StateStore';
import HOST from '../../../../config';

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
    open, isMarketer, classes, handleClose, logout,
  } = props;
  const { state } = useContext(StateContext);
  const { history } = state;
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
      .catch(() => {
        setUserid('');
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
        onClose={handleClose}
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
              href={`${HOST}/api/login/twitch`}
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
      {dialog}
      <FindDialog
        dialogType={dialogType}
        findDialogOpen={findDialogOpen}
        handleFindDialogClose={() => { setFindDialogOpen(false); }}
        handleClose={handleClose}
      />
    </div>
  );
};

LoginForm.defaultProps = {
  classes: {},
  isMarketer: true,
  logout: () => {},
  handleClose: () => {},
};

LoginForm.propTypes = {
  open: PropTypes.bool.isRequired,
  classes: PropTypes.object,
  isMarketer: PropTypes.bool,
  logout: PropTypes.func,
  handleClose: PropTypes.func,
};

export default withStyles(styles)(LoginForm);
