import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Hidden,
} from '@material-ui/core';
import LockOpen from '@material-ui/icons/LockOpen';
import SupervisedUserCircle from '@material-ui/icons/SupervisedUserCircle';
import { withStyles } from '@material-ui/core/styles';
import LoginForm from './LoginForm';
import RegistDialog from '../../../Regist/RegistDialog';

import history from '../../../../../history';

const styles = theme => ({
  rightLink: {
    fontFamily: 'Noto Sans KR',
    color: theme.palette.common.white,
    marginLeft: 0,
    fontSize: 20,
    fontWeight: 'bold',
    [theme.breakpoints.up('md')]: {
      color: theme.palette.common.white,
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      '&:hover': {
        fontWeight: 'bold',
      },
    },
  },
  rightLink2: {
    fontFamily: 'Noto Sans KR',
    color: 'black',
    marginLeft: 0,
    fontSize: 20,
    fontWeight: 'bold',
    [theme.breakpoints.up('md')]: {
      color: 'black',
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      '&:hover': {
        fontWeight: 'bold',
      },
    },
  },
  str_rightLink: {
    fontFamily: 'Noto Sans KR',
    width: 180,
    background: '#3154EB',
    color: theme.palette.common.white,
    marginLeft: 0,
    fontSize: 20,
    height: '100%',
    padding: '0px 10px',
    fontWeight: 'bold',
    '&:hover': {
      color: 'black'
    },
    [theme.breakpoints.up('md')]: {
      color: theme.palette.common.white,
      marginLeft: theme.spacing(3),
      '&:hover': {
        fontWeight: 'bold',
      },
    },
  },
  button: {
    width: '100%',
  },
});

// login
// regist가 다르게 렌더링 되어야함.
// RegistDialog 열기
class LoginPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginValue: null,
      registOpen: false
    };
  }

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

  handleDialogClose = () => {
    this.setState({
      loginValue: null,
    });
  }

  handleRegistClose = () => {
    this.setState({
      registOpen: false,
    });
  }

  handleRegistOpen = () => {
    this.setState({
      registOpen: true,
    });
  }


  render() {
    const {
      classes, type, logout, MainUserType, trigger, mode
    } = this.props;

    const { loginValue, registOpen } = this.state;

    return (
      <React.Fragment>
        {type === '로그인'
          ? (
            <React.Fragment>
              <Button
                className={classes.str_rightLink}
                onClick={() => {
                  if (MainUserType === 'marketer') {
                    this.handleDialogOpenClick('marketer');
                  } else {
                    this.handleDialogOpenClick('creator');
                  }
                }}
              >
                <Hidden mdUp>
                  <LockOpen />
                </Hidden>
                  온애드 시작하기
              </Button>

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
              { MainUserType === 'marketer' ? (
                <div>
                  { mode ? (
                    <Button
                      className={classes.rightLink2}
                      onClick={this.handleRegistOpen}
                    >
                      <Hidden mdUp>
                        <SupervisedUserCircle style={{ marginRight: 10 }} />
                      </Hidden>
                      회원가입
                    </Button>
                  ) : (
                    <Button
                      className={!trigger ? (classes.rightLink) : (classes.rightLink2)}
                      onClick={this.handleRegistOpen}
                    >
                      <Hidden mdUp>
                        <SupervisedUserCircle style={{ marginRight: 10 }} />
                      </Hidden>
                      회원가입
                    </Button>
                  )}
                </div>

              ) : (
                <div>
                  { mode ? (
                    <Button
                      className={classes.rightLink2}
                      onClick={() => {
                        alert('현재, Twitch 아이디로 로그인할 수 있어요! 확인 이후 로그인하세요!');
                        this.handleDialogOpenClick('creator');
                      }}
                    >
                      <Hidden mdUp>
                        <SupervisedUserCircle style={{ marginRight: 10 }} />
                      </Hidden>
                      회원가입
                    </Button>
                  ) : (
                    <Button
                      className={!trigger ? (classes.rightLink) : (classes.rightLink2)}
                      onClick={() => {
                        alert('현재, Twitch 아이디로 로그인할 수 있어요! 확인 이후 로그인하세요!');
                        this.handleDialogOpenClick('creator');
                      }}
                    >
                      <Hidden mdUp>
                        <SupervisedUserCircle style={{ marginRight: 10 }} />
                      </Hidden>
                      회원가입
                    </Button>
                  )}
                </div>
              )
              }
              <LoginForm
                open={loginValue === 'creator'}
                isMarketer={false}
                history={history}
                handleClose={this.handleDialogClose}
                logout={logout}
              />
              <RegistDialog
                open={registOpen}
                handleClose={this.handleRegistClose}
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
