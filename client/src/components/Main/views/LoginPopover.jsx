import React, { Component } from 'react';
import {
  Button,
  Popover,
} from '@material-ui/core';
import LoginForm from './LoginForm';

// login
// regist가 다르게 렌더링 되어야함.

export default class LoginPopover extends Component {
  state = {
    anchorEl: null,
  };

  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  buttonStyle = {
    margin: '10px',
  }

  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <React.Fragment>
        <Button
          aria-owns={open ? 'simple-popper' : undefined}
          aria-haspopup="true"
          color="inherit"
          onClick={this.handleClick}
        >
          {this.props.type}
        </Button>
        <Popover
          id="simple-popper"
          open={open}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          {this.props.type === '로그인'
            ? (
              <div>
                <LoginForm style={this.buttonStyle} isMarketer />
                <LoginForm style={this.buttonStyle} isMarketer={false} />
              </div>
            )
            : (
              <div>
                <div style={this.buttonStyle}>
                  <Button href="/regist">MARKETER</Button>
                </div>
                <div style={this.buttonStyle}>
                  <Button href="https://www.twitch.tv">CREATOR</Button>
                </div>
              </div>
            )
        }
        </Popover>
      </React.Fragment>
    );
  }
}
