import { useMemo, useState } from 'react';
import { Button } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import useStyles from '../style/LoginPopover.style';
import MarketerLoginForm from './MarketerLoginForm';
import CreatorLoginForm from './CreatorLoginForm';
import RegistDialog from '../../regist/RegistDialog';
import history from '../../../../history';

interface LoginPopoverProps {
  type: '로그인' | '회원가입';
}

// login
// regist가 다르게 렌더링 되어야함.
// RegistDialog 열기
function LoginPopover({ type = '회원가입' }: LoginPopoverProps): JSX.Element {
  const { pathname } = useLocation();
  const isMarketerPage = useMemo(() => pathname.includes('/marketer'), [pathname]);

  const [loginValue, setLoginValue] = useState('');
  const [registOpen, setRegistOpen] = useState(false);

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
      {type === '로그인' ? (
        <>
          <Button
            className={isMarketerPage ? classes.str_rightLink : classes.str_rightLink2}
            onClick={() => {
              if (isMarketerPage) {
                handleDialogOpenClick('marketer');
              } else {
                handleDialogOpenClick('creator');
              }
            }}
          >
            온애드 시작하기
          </Button>

          <MarketerLoginForm open={loginValue === 'marketer'} handleClose={handleDialogClose} />
          <CreatorLoginForm open={loginValue === 'creator'} handleClose={handleDialogClose} />
        </>
      ) : (
        <>
          {isMarketerPage ? (
            <div>
              <Button className={classes.rightLink} onClick={handleRegistOpen}>
                회원가입
              </Button>
            </div>
          ) : (
            <div>
              <Button
                className={classes.rightLink}
                onClick={() => {
                  history.push('/creator/signup');
                }}
              >
                회원가입
              </Button>
            </div>
          )}
          <CreatorLoginForm open={loginValue === 'creator'} handleClose={handleDialogClose} />
          <RegistDialog open={registOpen} handleClose={handleRegistClose} />
        </>
      )}
    </>
  );
}

export default LoginPopover;
