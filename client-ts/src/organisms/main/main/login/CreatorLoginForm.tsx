import React from 'react';
import classnames from 'classnames';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  Button,
  Typography
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
  return (
    (
      // 크리에이터 로그인 창
      <Dialog
        open={open}
        onClose={handleClose}
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
          <div>
            <Button
              href={`${HOST}/login/twitch`}
              variant="contained"
              className={classnames(classes.socialLoginButton, classes.twitch)}
            >
              <img src="/pngs/logo/twitch/TwitchGlitchWhite.png" alt="" className={classes.socialLogo} />
              <Typography variant="body1">트위치 아이디로 로그인</Typography>
            </Button>
            <Button
              href={`${HOST}/login/afreeca`}
              variant="contained"
              className={classnames(classes.socialLoginButton, classes.afreeca)}
            >
              <img src="/pngs/logo/afreeca/onlyFace.png" alt="" className={classes.socialLogo} />
              <Typography variant="body1">아프리카TV 아이디로 로그인</Typography>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
}
