import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import classnames from 'classnames';
import { useState } from 'react';
import OnadLogo from '../../../../atoms/Logo/OnadLogo';
import StyledTooltip from '../../../../atoms/Tooltip/StyledTooltip';
import history from '../../../../history';
import { useEventTargetValue } from '../../../../utils/hooks';
import { useLoginMutation } from '../../../../utils/hooks/mutation/useLoginMutation';
import useStyles from '../style/LoginForm.style';

interface CreatorLoginFormProps {
  open: boolean;
  handleClose: () => void;
}

export default function CreatorLoginForm({
  open,
  handleClose,
}: CreatorLoginFormProps): JSX.Element {
  const classes = useStyles();

  const userid = useEventTargetValue();
  const passwd = useEventTargetValue();
  const [error, setError] = useState<string>();

  const loginMutation = useLoginMutation();

  const handleLogin = (): void => {
    loginMutation
      .mutateAsync({ type: 'creator', userid: userid.value, passwd: passwd.value })
      .then(res => {
        passwd.handleReset();
        setTimeout(() => {
          // 15초 간의 timeout을 두고, 로딩 컴포넌트를 없앤다
          setError('로그인에 일시적인 문제가 발생했습니다.\n잠시후 다시 시도해주세요.');
        }, 1000 * 10); // 15초

        if (res.data[0]) {
          if (res.data[1]) setError(res.data[1] as string);
        }
        if (res.data === 'success') history.push('/mypage/creator/main');
      })
      .catch(err => {
        setError(err.response.data.message);
      });
  };

  return (
    // 크리에이터 로그인 창
    <Dialog
      open={open}
      onClose={(): void => {
        handleClose();
        userid.handleReset();
        passwd.handleReset();
      }}
      maxWidth="xs"
      fullWidth
      disableScrollLock
      disableBackdropClick
    >
      <DialogContent className={classes.dialog}>
        <IconButton onClick={handleClose} style={{ position: 'absolute', top: 10, right: 10 }}>
          <Close />
        </IconButton>

        <div style={{ marginBottom: 8, marginTop: 8 }}>
          <OnadLogo width={80} />
        </div>
        <Typography variant="h6">온애드 방송인 로그인</Typography>

        <form style={{ marginTop: 16 }}>
          <TextField
            style={{ marginBottom: 16 }}
            InputProps={{ style: { height: 40 } }}
            fullWidth
            variant="outlined"
            autoFocus
            placeholder="아이디"
            onChange={userid.handleChange}
            value={userid.value}
          />
          <TextField
            style={{ marginBottom: 16 }}
            InputProps={{ style: { height: 40 } }}
            fullWidth
            variant="outlined"
            type="password"
            placeholder="비밀번호"
            onChange={passwd.handleChange}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                handleLogin();
              }
            }}
            value={passwd.value}
          />
        </form>

        {error && (
          <Alert severity="error" icon={false}>
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
          fullWidth
        >
          로그인
        </Button>

        <Divider style={{ marginTop: 16, marginBottom: 16 }} />

        <div style={{ marginTop: 16, marginBottom: 16 }}>
          {/* <Typography variant="body2">
            온애드 계정이 없으신가요?&nbsp;
            <Typography
              component="span"
              variant="body2"
              onClick={(): void => history.push('/creator/signup')}
              style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }}
            >
              가입하기
            </Typography>
          </Typography> */}
          <Typography variant="body2">
            트위치 계정 로그인 방식으로 온애드를 사용했었나요?&nbsp;
            <StyledTooltip
              open
              arrow
              interactive
              title={<Typography variant="body2">기존회원은여기</Typography>}
            >
              <Typography
                component="span"
                variant="body2"
                onClick={(): void => history.push('/creator/signup/pre-user')}
                style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }}
              >
                기존계정로그인
              </Typography>
            </StyledTooltip>
          </Typography>
        </div>
      </DialogContent>

      {loginMutation.isLoading && (
        <div className={classes.buttonLoading}>
          <CircularProgress />
        </div>
      )}
    </Dialog>
  );
}
