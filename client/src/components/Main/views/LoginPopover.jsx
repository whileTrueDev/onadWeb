import React, { Component } from 'react';
import {
  Button,
  Popover,
} from '@material-ui/core';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
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
    margin: 10,
  },
  buttonStyle: {
    margin: 10,
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
    const { classes, type } = this.props;
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
                <div>
                  <LoginForm isMarketer />
                  <LoginForm isMarketer={false} />
                </div>
              </Popover>
            </React.Fragment>
          )
          : (
            <React.Fragment>
              <div>
                <Button
                  className={clsx(classes.rightLink, classes.linkSecondary)}
                  aria-owns={open ? 'simple-popper' : undefined}
                  aria-haspopup="true"
                  color="inherit"
                  onClick={this.handleClick}
                >
                  {'회원가입'}
                </Button>
              </div>
              <div>
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
                  <div>
                    <div>
                      <Button component={Link} to="/regist">마케터</Button>
                    </div>
                    <div style={this.buttonStyle}>
                      <Button href="https://www.twitch.tv">크리에이터</Button>
                    </div>
                  </div>
                </Popover>
              </div>
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
