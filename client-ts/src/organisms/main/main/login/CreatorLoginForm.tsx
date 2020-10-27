import React, { useState } from 'react';
import classnames from 'classnames';
import {
  Dialog, DialogContent, DialogContentText, Button, Typography, CircularProgress
} from '@material-ui/core';
import useStyles from '../style/LoginForm.style';
import HOST from '../../../../config';

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

  return (
    (
      // 크리에이터 로그인 창
      <Dialog
        open={open}
        onClose={(): void => {
          handleClose();
          setHelperText('');
          setLoading(false);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent className={classes.dialog}>
          <DialogContentText variant="h4" color="textPrimary" className={classes.dialogTitle}>
              로그인
          </DialogContentText>
          <DialogContentText variant="body1" color="textPrimary">
            별도 회원가입 없이 소셜 로그인으로 온애드를 이용하세요.
          </DialogContentText>

          {/* error helper text */}
          {helperText && helperText.split('\n').map((t) => (
            <Typography variant="body2" color="error" key={t}>
              {t}
            </Typography>
          ))}

          <LoginButton loginLink={`${HOST}/login/twitch`} logo="/pngs/logo/twitch/TwitchGlitchWhite.png" text="트위치 아이디로 로그인" platform="twitch" />
          <LoginButton loginLink={`${HOST}/login/afreeca`} logo="/pngs/logo/afreeca/onlyFace.png" text="아프리카TV 아이디로 로그인" platform="afreeca" />
        </DialogContent>
        {loading && (
          <div className={classes.buttonLoading}><CircularProgress /></div>
        )}
      </Dialog>
    )
  );
}
