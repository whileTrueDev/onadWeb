import {
  Dialog,
  DialogContent,
  Button,
  TextField,
  Divider,
  Typography,
  IconButton,
  CircularProgress,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
// 내부 소스
// 프로젝트 내부 모듈
import classnames from 'classnames';
import Image from 'next/image';
import { useState } from 'react';
import * as React from 'react';
import { useRouter } from 'next/router';
import kakaoLogo from '../../../public/logo/kakao/kakaolink_btn_small.png';
import naverLogo from '../../../public/logo/naver/naver_icon_green.png';
import googleLogo from '../../../public/logo/google/google.png';
// 컴포넌트
import FindDialog from './findDialog';
import OnadLogo from '../../shared/onadLogo';
// util 계열
import { useLoginMutation } from '../../../utils/hooks/mutation/useLoginMutation';
import { MarketerInfo } from '../../../utils/hooks/query/useMarketerProfile';
import HOST from '../../../config';
// 스타일
import useStyles from '../../../styles/mainpage/login/loginForm.style';

interface Props {
  open: boolean;
  handleClose: () => void;
  logout?: () => void;
}
// TODO: 비밀번호 암호화하여 전달하기.
function LoginForm({ open, handleClose }: Props): JSX.Element {
  // prop를 통해 Marketer 인지 Creator인지 확인.
  // 데이터가 변경되는 것일 때 state로 처리를 한다.
  const classes = useStyles();
  const [findDialogOpen, setFindDialogOpen] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<string>('ID');
  const [userid, setUserid] = useState<string>('');
  const [passwd, setPasswd] = useState<string>('');
  const router = useRouter();
  // 하나의 change로 값을 받을 수 있다.
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'userid') {
      setUserid(event.target.value);
    } else {
      setPasswd(event.target.value);
    }
  };

  const [loading, setLoading] = useState(false);

  const loginMutation = useLoginMutation();
  const login = (event: React.SyntheticEvent) => {
    if (event) {
      event.preventDefault();
    }
    setLoading(true);
    loginMutation
      .mutateAsync({ userid, passwd, type: 'marketer' })
      .then(res => {
        if (res.data[0]) {
          setPasswd('');
          alert(res.data[1]);
          if (res.data[1] === '이메일 본인인증을 해야합니다.') {
            handleClose();
          }
        } else {
          const userData = res.data[1] as MarketerInfo;
          if (userData.temporaryLogin) {
            handleClose();
            router.push('/');
          } else {
            // dispatch({ type: 'session', data: userData });
            handleClose();
            router.push('/mypage/marketer/main');
          }
        }
      })
      .catch(reason => {
        console.log(reason);
        setPasswd(''); // 비밀번호 초기화
        alert('회원이 아닙니다.');
      });
  };

  const dialog = (
    // 마케터 로그인 창
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogContent className={classes.dialog}>
        <IconButton onClick={handleClose} style={{ position: 'absolute', top: 10, right: 10 }}>
          <Close />
        </IconButton>

        <div style={{ marginBottom: 8, marginTop: 8 }}>
          <OnadLogo width={80} height={30} />
        </div>

        <Typography variant="h6">온애드 광고주 로그인</Typography>

        <form className={classes.form}>
          <TextField
            placeholder="아이디"
            style={{ marginTop: 16 }}
            InputProps={{ style: { height: 40 } }}
            variant="outlined"
            autoFocus
            value={userid}
            name="userid"
            fullWidth
            onChange={onChange}
          />
          <TextField
            placeholder="비밀번호"
            style={{ marginTop: 16 }}
            InputProps={{ style: { height: 40 } }}
            variant="outlined"
            type="password"
            value={passwd}
            name="passwd"
            onChange={onChange}
            fullWidth
            onKeyPress={e => {
              if (e.key === 'Enter') login(e);
            }}
          />

          <Button
            className={classnames(classes.loginButton, classes.socialLoginButton)}
            variant="contained"
            onClick={login}
            color="primary"
            fullWidth
            style={{ marginTop: 16, marginBottom: 8 }}
          >
            로그인
          </Button>
        </form>

        <Divider component="hr" orientation="horizontal" className={classes.divider} />

        <Button
          onClick={(): Promise<boolean> => router.push(`${HOST}/login/google`)}
          fullWidth
          className={classnames(classes.loginButton, classes.socialLoginButton, classes.google)}
          style={{ alignItems: 'center' }}
        >
          <Image src={googleLogo} alt="googleLogo" width={30} height={30} />
          구글 아이디로 로그인
        </Button>
        <Button
          onClick={(): Promise<boolean> => router.push(`${HOST}/login/naver`)}
          fullWidth
          className={classnames(classes.loginButton, classes.socialLoginButton, classes.naver)}
          style={{ alignItems: 'center' }}
        >
          <Image src={naverLogo} alt="naverLogo" width={30} height={30} />
          네이버 아이디로 로그인
        </Button>
        <Button
          onClick={(): Promise<boolean> => router.push(`${HOST}/login/kakao`)}
          fullWidth
          className={classnames(classes.loginButton, classes.socialLoginButton, classes.kakao)}
          style={{ alignItems: 'center' }}
        >
          <Image src={kakaoLogo} alt="kakaoLogo" width={30} height={30} />
          카카오 아이디로 로그인
        </Button>

        <Divider component="hr" orientation="horizontal" className={classes.divider} />

        <div style={{ marginTop: 16 }}>
          <Typography variant="body2" color="textSecondary">
            계정이 없으신가요?&nbsp;
            {/* eslint-disable-next-line */}
            <span
              style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }}
              onClick={(): Promise<boolean> => router.push('/regist/main')}
            >
              회원가입하기
            </span>
          </Typography>

          <Typography variant="body2" color="textSecondary">
            아이디가 기억나지 않나요?&nbsp;
            {/* eslint-disable-next-line */}
            <span
              onClick={(): void => {
                setDialogType('ID');
                setFindDialogOpen(true);
              }}
              style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }}
            >
              아이디 찾기
            </span>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            비밀번호가 기억나지 않나요?&nbsp;
            {/* eslint-disable-next-line */}
            <span
              onClick={(): void => {
                setDialogType('PASSWORD');
                setFindDialogOpen(true);
              }}
              style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }}
            >
              비밀번호 찾기
            </span>
          </Typography>
        </div>
      </DialogContent>

      {loading && (
        <div className={classes.buttonLoading}>
          <CircularProgress />
        </div>
      )}
    </Dialog>
  );

  return (
    <div>
      {dialog}
      <FindDialog
        dialogType={dialogType}
        findDialogOpen={findDialogOpen}
        handleFindDialogClose={(): void => {
          setFindDialogOpen(false);
        }}
        handleClose={handleClose}
      />
    </div>
  );
}

export default LoginForm;
