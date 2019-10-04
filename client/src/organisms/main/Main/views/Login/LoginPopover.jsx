import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Button, Popover, Hidden,
} from '@material-ui/core';
import LockOpen from '@material-ui/icons/LockOpen';
import SupervisedUserCircle from '@material-ui/icons/SupervisedUserCircle';
import { withStyles } from '@material-ui/core/styles';
import LoginForm from './LoginForm';
import history from '../../../../../history';

const styles = theme => ({
  rightLink: {
    color: theme.palette.common.black,
    marginLeft: 0,
    fontSize: 16,
    fontWeight: theme.typography.fontWeightRegular,
    [theme.breakpoints.up('md')]: {
      color: theme.palette.common.white,
      marginLeft: theme.spacing(3),
      '&:hover': {
        fontWeight: 'bold',
      },
    },
  },
  linkPriamry: {
    color: theme.palette.primary.main,
  },
  popOver: {
    marginTop: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '100%',
  },
  popOverButton: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    alignItems: 'center',
    textAlign: 'center',
  },
});

// login
// regist가 다르게 렌더링 되어야함.
class LoginPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      loginValue: null,
    };
  }

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

  handleDialogOpenClick = (newValue) => {
    this.setState({
      loginValue: newValue,
    });
  }

  handleDialogClose = () => {
    this.setState({
      loginValue: null,
    });
  }


  render() {
    const {
      classes, type, logout,
    } = this.props;
    const { anchorEl, loginValue } = this.state;
    const open = Boolean(anchorEl);

    return (
      <React.Fragment>
        { type === '로그인'
          ? (
            <React.Fragment>
              <Button
                className={classes.rightLink}
                color="inherit"
                onClick={this.handleClick}
              >
                <Hidden mdUp>
                  <LockOpen style={{ marginRight: 10 }} />
                </Hidden>
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
                <div className={classes.popOverButton}>
                  <Button
                    className={classes.button}
                    onClick={() => {
                      this.handleDialogOpenClick('marketer'); this.handleClose();
                    }}
                  >
                    마케터
                  </Button>
                  <Button
                    className={classes.button}
                    onClick={
                      (() => {
                        this.handleDialogOpenClick('creator');
                        this.handleClose();
                      })
                    }
                  >
                    크리에이터
                  </Button>
                </div>
              </Popover>

              <LoginForm
                open={loginValue === 'marketer'}
                isMarketer
                history={history}
                handleClose={this.handleDialogClose}
                logout={logout}
              />
              <LoginForm
                open={loginValue === 'creator'}
                isMarketer={false}
                history={history}
                handleClose={this.handleDialogClose}
                logout={logout}
              />

            </React.Fragment>
          )
          : (
            <React.Fragment>
              <Button
                className={classnames(classes.rightLink, classes.linkPriamry)}
                color="inherit"
                // // 클로즈베타를 위해 회원가입을 막아둠
                // onClick={this.handleClick}
                onClick={this.handleClick}
              >
                <Hidden mdUp>
                  <SupervisedUserCircle style={{ marginRight: 10 }} />
                </Hidden>
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
                <div className={classes.popOverButton}>
                  <Button component={Link} to="/regist" className={classes.button}>마케터</Button>
                  <Button
                    onClick={() => {
                      alert('현재, Twitch 아이디로 로그인할 수 있어요! 확인 이후 로그인하세요!');
                      this.handleDialogOpenClick('creator');
                      this.handleClose();
                    }}
                    className={classes.button}
                  >
                  크리에이터
                  </Button>
                </div>
              </Popover>

              <LoginForm
                open={loginValue === 'creator'}
                isMarketer={false}
                history={history}
                handleClose={this.handleDialogClose}
                logout={logout}
              />
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
