import React, { Component } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@material-ui/core';


// TODO: 비밀번호 암호화하여 전달하기.
export default class LoginForm extends Component {
  // prop를 통해 Marketer 인지 Creator인지 확인.
  // 데이터가 변경되는 것일 때 state로 처리를 한다.
  state = {
    open: false,
    userid: '',
    passwd: '',
  };

  // 하나의 change로 값을 받을 수 있다.
  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
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
    event.preventDefault();
    axios.post('/login',
      {
        userid: this.state.userid,
        passwd: this.state.passwd,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        alert('회원이 아닙니다.');
      });
    this.handleClose();
  }

  render() {
    let dialog;
    const { isMarketer } = this.props;
    if (isMarketer) {
      dialog = (
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth="sm"
        >
          <DialogTitle id="form-dialog-title">LOGIN</DialogTitle>
          <DialogContent>
            <DialogContentText>
          온애드로 쉽고 빠르게!
            </DialogContentText>
            <form onChange={this.onChange}>
              <label><b>Username</b></label>
              <input type="text" placeholder="userid" name="userid" required />
              <br />
              <label><b>Password</b></label>
              <input type="password" placeholder="Enter Password" name="passwd" required />
              <br />
            </form>
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
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth="sm"
        >
          <DialogTitle id="form-dialog-title">LOGIN</DialogTitle>
          <DialogContent>
            <DialogContentText>
          트위치로 로그인 하세요!
            </DialogContentText>
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
    }
    return (
      <div style={this.props.style}>
        <Button color="inherit" onClick={this.handleClickOpen}>
          {isMarketer ? '마케터' : '크리에이터'}
        </Button>
        {dialog}
      </div>
    );
  }
}
