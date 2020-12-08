import React, { useState } from 'react';
import classnames from 'classnames';
import {
  Dialog, DialogContent, Button, Typography, CircularProgress, TextField, Divider
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import useStyles from '../style/LoginForm.style';
import axios from '../../../../utils/axios';
import HOST from '../../../../config';
import history from '../../../../history';
import { useEventTargetValue } from '../../../../utils/hooks';

interface CreatorLoginFormProps {
  open: boolean;
  handleClose: () => void;
}

export default function CreatorLoginForm({
  open,
  handleClose
}: CreatorLoginFormProps): JSX.Element {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [helperText, setHelperText] = useState<string>();

  // 각 플랫폼 로그인 버튼 - loading 을 가진다.
  const LoginButton = ({
    loginLink, logo, text, platform
  }: { loginLink: string; logo: string; text: string; platform: 'twitch' | 'afreeca'}): JSX.Element => (
    <Button
      onClick={(e): void => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => { // 15초 간의 timeout을 두고, 로딩 컴포넌트를 없앤다
          setLoading(false);
          setHelperText('로그인에 일시적인 문제가 발생했습니다.\n잠시후 다시 시도해주세요.');
        }, 1000 * 15); // 15초
        window.location.href = loginLink;
      }}
      variant="contained"
      className={classnames(classes.socialLoginButton, classes[platform])}
      disabled={loading || Boolean(helperText)}
    >
      <img src={logo} alt="" className={classes.socialLogo} />
      <Typography variant="body1">{text}</Typography>
    </Button>
  );

  const userid = useEventTargetValue();
  const passwd = useEventTargetValue();
  const [error, setError] = useState<string>();
  const handleLogin = (): void => {
    setLoading(true);
    axios.post(`${HOST}/login`, { type: 'creator', userid: userid.value, passwd: passwd.value })
      .then((res) => {
        setLoading(false);
        passwd.handleReset();
        setTimeout(() => { // 15초 간의 timeout을 두고, 로딩 컴포넌트를 없앤다
          setLoading(false);
          setHelperText('로그인에 일시적인 문제가 발생했습니다.\n잠시후 다시 시도해주세요.');
        }, 1000 * 10); // 15초

        if (res.data[0]) {
          if (res.data[1]) setError(res.data[1]);
        }
        if (res.data === 'success') history.push('/mypage/creator/main');
      })
      .catch((err) => {
        setLoading(false);
        setError(err.response.data.message);
      });
  };
  return (
    (
      // 크리에이터 로그인 창
      <Dialog
        open={open}
        onClose={(): void => {
          handleClose();
          userid.handleReset();
          passwd.handleReset();
          setLoading(false);
        }}
        maxWidth="sm"
        fullWidth
        disableScrollLock
      >
        <DialogContent className={classes.dialog}>

          <img src="/pngs/logo/onad_logo_vertical_small.png" alt="" width={80} height={80} />

          <form style={{ marginTop: 16 }}>
            <TextField
              style={{ marginBottom: 16 }}
              fullWidth
              variant="outlined"
              autoFocus
              placeholder="아이디"
              onChange={userid.handleChange}
              value={userid.value}
            />
            <TextField
              style={{ marginBottom: 16 }}
              fullWidth
              variant="outlined"
              type="password"
              placeholder="비밀번호"
              onChange={passwd.handleChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }}
              value={passwd.value}
            />
          </form>

          {error && (
            <Alert severity="error">
              <Typography>{error}</Typography>
            </Alert>
          )}

          {/* new 로그인 */}
          <Button
            color="primary"
            variant="contained"
            disableElevation
            className={classnames(classes.socialLoginButton)}
            onClick={handleLogin}
          >
            로그인
          </Button>

          {/* <LoginButton
            loginLink={`${HOST}/login/twitch`}
            logo="/pngs/logo/twitch/TwitchGlitchWhite.png"
            text="트위치 아이디로 로그인"
            platform="twitch"
          /> */}
          <Divider style={{ marginTop: 16, marginBottom: 16 }} />

          <div style={{ margin: 16 }}>
            <Typography variant="body2" onClick={(): void => history.push('/creator/signup')}>
              온애드 계정이 없으신가요?&nbsp;
              <span style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }}>
                가입하기
              </span>
            </Typography>
            <Typography variant="body2">
              트위치 계정 로그인 방식으로 온애드를 사용했었나요?&nbsp;
              <span style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }}>
                기존계정로그인
              </span>
            </Typography>
          </div>
        </DialogContent>

        {loading && (
          <div className={classes.buttonLoading}><CircularProgress /></div>
        )}


      </Dialog>
    )
  );
}
