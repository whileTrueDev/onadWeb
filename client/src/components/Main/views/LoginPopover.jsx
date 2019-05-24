import React, { Component } from 'react';
import {
  Button,
  Popover,
} from '@material-ui/core';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';

const styles = theme => ({
  rightLink: {
    color: theme.palette.common.black,
    marginLeft: 0,
    fontSize: 16,
    [theme.breakpoints.up('md')]: {
      color: theme.palette.common.white,
      marginLeft: theme.spacing(3),
      '&:hover': {
        fontWeight: 'bold',
      },
    },
  },
  linkSecondary: {
    color: theme.palette.secondary.main,
  },
  popOver: {
    marginTop: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',

  },
  button: {
    fontWeight: 800,
    width: '100%',
  },
});

// login
// regist가 다르게 렌더링 되어야함.
class LoginPopover extends Component {
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

  render() {
    const {
      classes, type, history, logout,
    } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <React.Fragment>
        { type === '로그인'
          ? (
            <React.Fragment>
              <Button
                className={classes.rightLink}
                aria-owns={open ? 'simple-popper' : undefined}
                aria-haspopup="true"
                color="inherit"
                onClick={this.handleClick}
              >
                {'로그인'}
              </Button>
              <Popover
                className={classes.popOver}
                id="login-poper"
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
                <div style={{
                  padding: 10,
                  alignItems: 'center',
                  textAlign: 'center',
                }}
                >
                  <LoginForm isMarketer history={history} handleClose={this.handleClose} logout={logout} />
                  <LoginForm isMarketer={false} history={history} handleClose={this.handleClose} logout={logout} />
                </div>
              </Popover>
            </React.Fragment>
          )
          : (
            <React.Fragment>
              <Button
                className={clsx(classes.rightLink, classes.linkSecondary)}
                aria-owns={open ? 'simple-popper' : undefined}
                aria-haspopup="true"
                color="inherit"
                onClick={this.handleClick}
              >
                {'회원가입'}
              </Button>
              <Popover
                className={classes.popOver}
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
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 10,
                  alignItems: 'center',
                  textAlign: 'center',
                }}
                >
                  <Button component={Link} to="/regist" className={classes.button}>마케터</Button>
                  <Button href="https://www.twitch.tv" className={classes.button}>크리에이터</Button>
                </div>
              </Popover>

            </React.Fragment>
          )
        }
      </React.Fragment>
    );
  }
}

LoginPopover.propTypes = {
  classes: PropTypes.object,
  type: PropTypes.string,
};

LoginPopover.defaultProps = {
  classes: {},
  type: '',
};

export default withStyles(styles)(LoginPopover);
