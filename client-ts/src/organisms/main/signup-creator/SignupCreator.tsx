import {
  Button,
  Divider,
  Grid, IconButton, InputAdornment, makeStyles, Paper,
  TextField, Typography
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Lock, Visibility, VisibilityOff } from '@material-ui/icons';
import React, { useState } from 'react';
import { useLoginValue } from '../../../utils/hooks';
import AppAppBar from '../layouts/AppAppbar';
import axiosInstance from '../../../utils/axios';
import HOST from '../../../config';
import IndentityVerificationDialog from './IdentityVerification';
import history from '../../../history';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));
export interface CreatorSignupInfo {
  userid: string; passwd: string; pwdVisibility: boolean;
}
export default function SignupCreator(): JSX.Element {
  const classes = useStyles();
  const { logout } = useLoginValue();

  // 회원가입 정보
  const [signupInfo, setSignupInfo] = useState<CreatorSignupInfo>({
    userid: '', passwd: '', pwdVisibility: false,
  });

  // 에러 정보
  const defaultHelperText = '영문자로 시작하는 영문 또는 숫자 6-15자';
  const [useridHelperText, setUseridHelperText] = useState(defaultHelperText);
  const [useridError, setUseridError] = useState<boolean>(false);
  const [pwdError, setPwdError] = useState<boolean>(false);

  // 단계 정보
  const [activeStep, setStep] = useState(0);
  function handleNext(): void {
    setStep(activeStep + 1);
  }

  function handleBack(): void {
    setStep(activeStep - 1);
  }

  // 본인인증 완료 이후 -> 회원가입 요청
  function handleSignup(): void {
    console.log(signupInfo.userid, signupInfo.passwd);
    axiosInstance.post(`${HOST}/creator`, {
      userid: signupInfo.userid, passwd: signupInfo.passwd
    })
      .then((res) => {
        alert(`${res.data}완료`); history.push('/creator/signup/complete');
      })
      .catch();
  }

  // 회원가입 정보 변경 핸들러
  const handleChange = (
    prop: keyof CreatorSignupInfo
  ) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (prop === 'passwd') {
      if (!signupInfo.pwdVisibility) {
        setSignupInfo({ ...signupInfo, [prop]: event.target.value });
      }
    } else {
      setSignupInfo({ ...signupInfo, [prop]: event.target.value });
    }
    setUseridHelperText(defaultHelperText);
    setUseridError(false);
    setPwdError(false);
  };

  // 비밀번호 보기 / 보지않기 버튼 핸들러
  const handleClickShowPassword = (): void => {
    setSignupInfo({ ...signupInfo, pwdVisibility: !signupInfo.pwdVisibility });
  };
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
  };

  // 아이디 에러 체크 ( 중복 체크 제외 )
  function useridErrorCheck(): boolean {
    const idReg = /^[A-za-z]{1}[a-z0-9]{5,14}$/g;
    if (!signupInfo.userid) return false;
    if (signupInfo.userid.length < 6 || signupInfo.userid.length > 15) {
      setUseridHelperText('아이디는 6자 이상, 15자 이하만 가능합니다.');
      setUseridError(true);
      return false;
    }
    if (!idReg.test(signupInfo.userid)) {
      setUseridHelperText(`${defaultHelperText}`);
      setUseridError(true);
      return false;
    }
    return true;
  }
  // 아이디 중복 체크
  async function duplicateCheck(): Promise<boolean> {
    const result = await axiosInstance.get<'duplicate' | 'allow'>(
      `${HOST}/creator/check-id`, { params: { userid: signupInfo.userid } }
    )
      .then((res) => {
        if (res.data === 'duplicate') {
          setUseridHelperText('중복되는 아이디가 존재합니다.');
          setUseridError(true);
          return false;
        }
        if (res.data === 'allow') return true;
        return false;
      })
      .catch(() => {
        setUseridHelperText('아이디 중복확인 도중에 오류가 발생했습니다. support@onad.io로 문의바랍니다.');
        setUseridError(true);
        return false;
      });
    return result;
  }

  // 비밀번호 에러 체크
  function passwdErrorCheck(): boolean {
    const regx = /^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^*+=-]).{8,20}$/;
    const isValid = regx.test(signupInfo.passwd);
    if (!isValid) {
      setPwdError(true);
    }
    return isValid;
  }

  // form 작성 오류 검사 -> 통과시 본인인증 다이얼로그 오픈
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const result = useridErrorCheck();
    if (result) {
      const allow = await duplicateCheck();
      if (allow) {
        if (passwdErrorCheck()) {
          // 회원가입 요청
          handleNext();
        }
      }
    }
  }

  // input icon 색상
  const [useridIconColor, setUseridIconColor] = useState<'primary' | 'disabled'>('disabled');
  const [pwIconColor, setPwIconColor] = useState<'primary' | 'disabled'>('disabled');

  return (
    <div className={classes.root}>
      <AppAppBar MainUserType="creator" logout={logout} noTrigger />
      <div style={{ paddingTop: 90 }} />

      <Grid container alignItems="center" direction="column">
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: 24, textAlign: 'center' }}>
            <Typography variant="h4" style={{ fontWeight: 'bold' }}>회원가입</Typography>

            {window.location.pathname === '/creator/signup/complete' && (
              <div>
                <Typography>회원가입이 완료되었습니다.</Typography>
                <Typography>회원가입 완료 페이지를 여기에.</Typography>
              </div>
            )}

            {/* 회원정보 받기 */}
            {!(window.location.pathname === '/creator/signup/complete') && activeStep === 0 && (
              <form
                onSubmit={handleSubmit}
                style={{ marginTop: 16, marginBottom: 16, minWidth: 270 }}
              >
                <TextField
                  style={{ marginBottom: 16 }}
                  fullWidth
                  variant="outlined"
                  placeholder="아이디"
                  onChange={handleChange('userid')}
                  value={signupInfo.userid}
                  error={useridError}
                  helperText={useridHelperText}
                  onFocus={(): void => setUseridIconColor('primary')}
                  onBlur={(): void => setUseridIconColor('disabled')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircleIcon color={useridIconColor} />
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  style={{ marginBottom: 16 }}
                  fullWidth
                  variant="outlined"
                  placeholder="비밀번호"
                  type={signupInfo.pwdVisibility ? 'text' : 'password'}
                  error={pwdError}
                  helperText="특수문자를 포함한 8-20자 영문 또는 숫자"
                  value={signupInfo.passwd}
                  onChange={handleChange('passwd')}
                  onFocus={(): void => setPwIconColor('primary')}
                  onBlur={(): void => setPwIconColor('disabled')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color={pwIconColor} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {signupInfo.pwdVisibility ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                <Button
                  type="submit"
                  color="primary"
                  size="large"
                  variant="contained"
                  style={{ width: '100%' }}
                  disabled={!signupInfo.userid || !signupInfo.passwd}
                >
                  가입하기
                </Button>

                <Button onClick={handleSignup}>
                  가입테스트
                </Button>
              </form>
            )}

            {/* 본인인증 진행 */}
            {!(window.location.pathname === '/creator/signup/complete') && activeStep === 1 && (
            <IndentityVerificationDialog
              onSuccess={handleSignup}
              onBackClick={handleBack}
            />
            )}


            {!(window.location.pathname === '/creator/signup/complete') && (
              <>
                <Divider />
                <div style={{ margin: 16 }}>
                  <Typography>
                    이미 온애드 계정이 있나요?&nbsp;
                    <span style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }}>
                      로그인
                    </span>
                  </Typography>
                  <Typography>
                    트위치 계정 로그인 방식으로 온애드를 사용했었나요?&nbsp;
                    <span style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }}>
                      기존계정연동
                    </span>
                  </Typography>
                </div>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

    </div>
  );
}
