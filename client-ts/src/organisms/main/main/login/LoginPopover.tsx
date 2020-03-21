import React from 'react';
import {
  Button, Hidden,
} from '@material-ui/core';
import LockOpen from '@material-ui/icons/LockOpen';
import SupervisedUserCircle from '@material-ui/icons/SupervisedUserCircle';
import useStyles from '../style/LoginPopover.style';
import LoginForm from './LoginForm';
import RegistDialog from '../../regist/RegistDialog';


interface Props {
  type?: string;
  logout: () => void;
  MainUserType?: string;
  trigger?: boolean;
  mode?: string | undefined;
}

// login
// regist가 다르게 렌더링 되어야함.
// RegistDialog 열기
function LoginPopover({
  type,
  MainUserType,
  trigger,
  mode,
  logout,
}: Props): JSX.Element {
  const [loginValue, setLoginValue] = React.useState('');
  const [registOpen, setRegistOpen] = React.useState(false);

  function handleDialogOpenClick(newValue: string): void {
    setLoginValue(newValue);
  }

  function handleDialogClose(): void {
    setLoginValue('');
  }

  function handleRegistClose(): void {
    setRegistOpen(false);
  }

  function handleRegistOpen(): void {
    setRegistOpen(true);
  }
  const classes = useStyles();

  return (
    <>
      {type === '로그인'
        ? (
          <>
            <Button
              className={classes.str_rightLink}
              onClick={() => {
                if (MainUserType === 'marketer') {
                  handleDialogOpenClick('marketer');
                } else {
                  handleDialogOpenClick('creator');
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
              handleClose={handleDialogClose}
              logout={logout}
            />
            <LoginForm
              open={loginValue === 'creator'}
              isMarketer={false}
              handleClose={handleDialogClose}
              logout={logout}
            />
          </>
        )
        : (
          <>
            {MainUserType === 'marketer' ? (
              <div>
                {mode ? (
                  <Button
                    className={classes.rightLink2}
                    onClick={handleRegistOpen}
                  >
                    <Hidden mdUp>
                      <SupervisedUserCircle style={{ marginRight: 10 }} />
                    </Hidden>
                    회원가입
                  </Button>
                )
                  : (
                    <Button
                      className={!trigger ? (classes.rightLink) : (classes.rightLink2)}
                      onClick={handleRegistOpen}
                    >
                      <Hidden mdUp>
                        <SupervisedUserCircle style={{ marginRight: 10 }} />
                      </Hidden>
                      회원가입
                    </Button>
                  )}
              </div>

            )
              : (
                <div>
                  {mode ? (
                    <Button
                      className={classes.rightLink2}
                      onClick={() => {
                        alert('현재, Twitch 아이디로 로그인할 수 있어요! 확인 이후 로그인하세요!');
                        handleDialogOpenClick('creator');
                      }}
                    >
                      <Hidden mdUp>
                        <SupervisedUserCircle style={{ marginRight: 10 }} />
                      </Hidden>
                      회원가입
                    </Button>
                  )
                    : (
                      <Button
                        className={!trigger ? (classes.rightLink) : (classes.rightLink2)}
                        onClick={() => {
                          alert('현재, Twitch 아이디로 로그인할 수 있어요! 확인 이후 로그인하세요!');
                          handleDialogOpenClick('creator');
                        }}
                      >
                        <Hidden mdUp>
                          <SupervisedUserCircle style={{ marginRight: 10 }} />
                        </Hidden>
                        회원가입
                      </Button>
                    )}
                </div>
              )}
            <LoginForm
              open={loginValue === 'creator'}
              isMarketer={false}
              handleClose={handleDialogClose}
              logout={logout}
            />
            <RegistDialog
              open={registOpen}
              handleClose={handleRegistClose}
            />
          </>
        )}
    </>
  );
}

export default LoginPopover;
