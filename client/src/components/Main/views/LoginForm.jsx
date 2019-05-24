import React, { Component } from 'react';
import axios from 'axios';
import {
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
  button: {
    fontWeight: 800,
    width: '100%',
  },
  imageSrc: {
    position: 'flex',
    backgroundSize: 'cover',
    backgroundPosition: 'inherit',
    margin: '20px',
    width: '50%',
    height: '80px',
  },
});
// TODO: 비밀번호 암호화하여 전달하기.
class LoginForm extends Component {
  // prop를 통해 Marketer 인지 Creator인지 확인.
  // 데이터가 변경되는 것일 때 state로 처리를 한다.
  state = {
    open: false,
    findDialogOpen: false,
    dialogType: 'ID',
    userid: '',
    passwd: '',
  };

  // 하나의 change로 값을 받을 수 있다.
  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleFindDialogOpen = () => {
    this.setState({
      findDialogOpen: true,
    });
  }

  handleFindDialogClose = () => {
    this.setState({
      findDialogOpen: false,
    });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    const { handleClose } = this.props;
    this.setState({ open: false });
    handleClose();
  };

  loginTwitch = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3000/login/twitch', {
      'Access-Control-Allow-Origin': '*',
    })
      .then((res) => {
        console.log(res);
      });
  }


  login = (event) => {
    const { userid, passwd } = this.state;
    const { history, logout, handleClose } = this.props;
    event.preventDefault();
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
            history.push('/dashboard/main');
          }
        } else {
          alert('이메일 본인인증을 해야합니다.');
          logout();
        }
        handleClose();
      })
      .catch(() => {
        handleClose();
        alert('회원이 아닙니다.');
      });
    this.handleClose();
  }

  twitchLogin = (event) => {
    // axios.get('')
  }

  render() {
    let dialog;
    const { isMarketer, classes } = this.props;
    const { open, dialogType, findDialogOpen } = this.state;
    if (isMarketer) {
      dialog = (
        <Dialog
          open={open}
          onClose={this.handleClose}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>LOGIN</DialogTitle>
          <DialogContent>
            <DialogContentText style={{ fontSize: 12 }}>
              온애드로 쉽고 빠르게!
            </DialogContentText>
            <form onChange={this.onChange}>
              <TextField
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
                margin="dense"
                name="passwd"
                InputLabelProps={{ shrink: true }}
                style={{ width: '90%' }}
              />
            </form>
            <Button
              component={Link}
              underline="always"
              style={{ fontSize: 10, marginTop: 10 }}
              onClick={() => {
                this.setState({
                  dialogType: 'ID',
                });
                this.handleFindDialogOpen();
              }}
            >아이디가 기억나지 않으신가요?
            </Button>
            <br />
            <Button
              component={Link}
              underline="always"
              style={{ fontSize: 10, marginTop: 10 }}
              onClick={() => {
                this.setState({
                  dialogType: 'PASSWORD',
                });
                this.handleFindDialogOpen();
              }}
            >비밀번호가 기억나지 않으신가요?
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.login} color="primary">
              로그인
            </Button>
            <Button onClick={this.handleClose} color="primary">
              취소
            </Button>
          </DialogActions>
        </Dialog>
      );
    } else {
      dialog = (
        <Dialog
          open={open}
          onClose={this.handleClose}
          maxWidth="sm"
        >
          <DialogTitle>LOGIN</DialogTitle>
          <DialogContent>
            <DialogContentText style={{ fontSize: 12 }}>
            당신의 CHANNEL을 선택하세요.
            </DialogContentText>
            <Button
              href="http://localhost:3000/login/twitch"
              style={{
                backgroundImage: 'url("pngs/twitch3.png")',
              }}
              className={classes.imageSrc}
            />
            {/* <Button href='http://localhost:3000/login/twitch'
                style={{
                  backgroundImage: `url("pngs/youtube2.png")`,
                }}
                className = {classes.imageSrc}
              />           */}
          </DialogContent>
        </Dialog>
      );
    }
    return (
      <div>
        <Button color="inherit" onClick={this.handleClickOpen} className={classes.button}>
          {isMarketer ? '마케터' : '크리에이터'}
        </Button>
        {dialog}
        <FindDialog dialogType={dialogType} findDialogOpen={findDialogOpen} handleFindDialogClose={this.handleFindDialogClose} handleClose={this.handleClose} />
      </div>
    );
  }
}

LoginForm.defaultProps = {
  classes: {},
};

LoginForm.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(LoginForm);
