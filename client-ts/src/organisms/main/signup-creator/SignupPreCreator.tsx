import classnames from 'classnames';
import { Button, Grid, Paper, Typography } from '@material-ui/core';
import { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { OnadTheme } from '../../../theme';
import HOST from '../../../config';

const useStyles = makeStyles((theme: OnadTheme) => ({
  socialLoginButton: {
    borderRadius: '0px',
    width: '100%',
    height: 60,
    margin: `${theme.spacing(1)}px 0px`,
    boxShadow: theme.shadows[0],
  },
  twitch: {
    color: theme.palette.getContrastText(theme.palette.platform.twitch),
    backgroundColor: theme.palette.platform.twitch,
    '&:hover': {
      backgroundColor: darken(theme.palette.platform.twitch, 0.07),
    },
  },
  afreeca: {
    color: theme.palette.getContrastText(theme.palette.platform.twitch),
    backgroundColor: theme.palette.platform.afreeca,
    '&:hover': {
      backgroundColor: darken(theme.palette.platform.afreeca, 0.07),
    },
  },
  socialLogo: {
    width: 35,
    height: 35,
    position: 'absolute',
    left: theme.spacing(2),
  },
}));

export default function SignupPreCreator(): JSX.Element {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [helperText, setHelperText] = useState<string>();
  // 각 플랫폼 로그인 버튼 - loading 을 가진다.
  const LoginButton = ({
    loginLink,
    logo,
    text,
    platform,
  }: {
    loginLink: string;
    logo: string;
    text: string;
    platform: 'twitch' | 'afreeca';
  }): JSX.Element => (
    <Button
      onClick={(e): void => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
          // 15초 간의 timeout을 두고, 로딩 컴포넌트를 없앤다
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
    <Grid container alignItems="center" direction="column">
      <Grid item xs={12} md={6} style={{ maxWidth: 500 }}>
        <Paper style={{ padding: 24, textAlign: 'center' }}>
          <Typography variant="h4" style={{ fontWeight: 'bold' }}>
            기존계정 연동
          </Typography>

          <Typography>온애드의 로그인 방식이 변경되었습니다.</Typography>

          <Typography>기존 계정 로그인시 사용할 ID/PW를 입력해주세요.</Typography>

          <div style={{ minWidth: 280, minHeight: 200 }}>
            <LoginButton
              loginLink={`${HOST}/login/twitch`}
              logo="/pngs/logo/twitch/TwitchGlitchWhite.png"
              text="트위치 아이디로 로그인"
              platform="twitch"
            />

            <Typography>
              1. 새로운 로그인 방식인 아이디/비번 입력 받고 (본인 인증 진행 X)
            </Typography>
            <Typography>2. 기존에 사용하던 트위치 계정으로 로그인</Typography>
            <Typography>3. 해당 유저의 loginId, passwd, passwdSalt를 채워넣는다</Typography>
            <Typography>4. creatorId는 건들지 않았으므로 그대로 사용 가능.</Typography>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
}
