// material-UI
import { Button } from '@material-ui/core';
// 프로젝트 내부 모듈
import { useState } from 'react';
// 컴포넌트
import MarketerLoginForm from './marketerLoginForm';
import CreatorLoginForm from './creatorLoginForm';
import RegistDialog from '../regist/registDialog';
import Link from 'next/link'
// util 계열
import history from '../../utils/history';
// 스타일
import useStyles from '../../styles/login/loginPopover.style';



interface LoginPopoverProps {
  type?: string;
  logout: () => void;
  MainUserType?: boolean;
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
}: LoginPopoverProps): JSX.Element {
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
            className={MainUserType ? classes.str_rightLink : classes.str_rightLink2}
            onClick={() => {
              if (MainUserType) {
                handleDialogOpenClick('marketer');
              } else {
                handleDialogOpenClick('creator');
              }
            }}
          >
            온애드 시작하기
          </Button>

          <MarketerLoginForm
            open={loginValue === 'marketer'}
            handleClose={handleDialogClose}
            logout={logout}
          />
          <CreatorLoginForm open={loginValue === 'creator'} handleClose={handleDialogClose} />
        </>
      ) : (
        <>
          {MainUserType ? (
            <div>
              <Button className={classes.rightLink} onClick={handleRegistOpen}>
                회원가입
              </Button>
            </div>
          ) : (
            <div>
              <Link
                href='/creator/signup'
              >
                <a className={classes.rightLink}>
                  회원가입
                </a>
              </Link>
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
