import {
  Button, IconButton, InputAdornment, TextField, Typography
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import React, { useState } from 'react';
import CustomDialog from '../../../../../atoms/Dialog/Dialog';
import HOST from '../../../../../config';
import axiosInstance from '../../../../../utils/axios';
import {
  useEventTargetValue, usePatchRequest, useToggle
} from '../../../../../utils/hooks';
import passwordRegex from '../../../../../utils/inputs/regex/password.regex';

export interface PasswordDialogProps {
  open: boolean;
  onClose: () => void;
  handleSnackOpen: () => void;
}
export default function PasswordDialog({
  open, onClose, handleSnackOpen,
}: PasswordDialogProps): JSX.Element {
  // ***************************************************
  // 단계 스테이트
  const [activeStep, setActiveStep] = useState(0);
  function handleNext(): void {
    setActiveStep((prev) => prev + 1);
  }
  function handleReset(): void {
    setActiveStep(0);
  }

  // ***************************************************
  // 기존 비밀번호 스테이트
  const password = useEventTargetValue();
  const passwordVisibility = useToggle(); // 비밀번호 보기/보지않기 스테이트

  // ***************************************************
  // 비밀번호 현재 체크
  const [passwordCheckFail, setPasswordCheckFail] = useState<string>('');
  function passwordCheck(cb: any): void {
    axiosInstance.post(`${HOST}/creator/password`, { password: password.value })
      .then((res) => {
        if (res.data) cb();
        else setPasswordCheckFail('비밀번호가 올바르지 않습니다.');
      })
      .catch(() => { setPasswordCheckFail('비밀번호 확인 과정에서 오류가 발생했습니다. 잠시후 다시 시도해주세요.'); });
  }


  // 변경할 비밀번호 스테이트
  const newPw = useEventTargetValue();
  const newPwVisibility = useToggle(); // 비밀번호 보기/보지않기 스테이트
  const newPwCheck = useEventTargetValue();
  const newPwCheckVisibility = useToggle(); // 비밀번호 보기/보지않기 스테이트

  // 올바른 비밀번호 체크
  function passwdErrorCheck(pwd: string): boolean {
    if (!passwordRegex.test(pwd)) return false;
    return true;
  }

  // ***************************************************
  // 다이얼로그 끄기 핸들러
  function handleDialogClose(): void {
    onClose();
    handleReset();
    setPasswordCheckFail('');
    password.handleReset();
    newPw.handleReset();
    newPwCheck.handleReset();
  }

  // ***************************************************
  // 비밀번호 변경 요청
  const [changeFailError, setChangeFailError] = useState<string>('');
  const { doPatchRequest } = usePatchRequest('/creator/password');
  function handleSubmit(): void {
    doPatchRequest({ password: newPw.value })
      .then((res) => {
        if (res.data > 0) { // 수정된 행 숫자 (affected Rows)
          handleSnackOpen();
          handleDialogClose();
        } else {
          setChangeFailError('비밀번호 변경 과정에서 오류가 발생했습니다. 잠시후 다시 시도해주세요!');
        }
      })
      .catch(() => {
        setChangeFailError('비밀번호 변경 과정에서 오류가 발생했습니다. 잠시후 다시 시도해주세요.');
      });
  }

  return (
    <CustomDialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={onClose}
      title="비밀번호 변경"
    >
      {activeStep === 0 && (

      <div>
        <Typography variant="body2" color="textSecondary">보안 인증을 위해 현재 비밀번호를 입력해주세요!</Typography>
        {/* 비밀번호 틀림 / 오류 알림 */}
        {passwordCheckFail && (<Alert severity="error">{passwordCheckFail}</Alert>)}

        {/* 비밀번호 창 */}
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <TextField
            autoFocus
            label="기존 비밀번호"
            fullWidth
            variant="filled"
            value={password.value}
            onKeyPress={(e) => {
              if (e.key === 'Enter') passwordCheck(handleNext);
            }}
            onChange={password.handleChange}
            type={passwordVisibility.toggle ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={passwordVisibility.handleToggle}
                  >
                    {passwordVisibility.toggle ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </div>
        <div style={{ textAlign: 'right' }}>
          <Button
            style={{ marginLeft: 4 }}
            variant="contained"
            color="primary"
            disabled={!password.value}
            onClick={() => {
              passwordCheck(handleNext);
            }}
          >
            다음
          </Button>
          <Button style={{ marginLeft: 4 }} onClick={handleDialogClose} variant="contained">취소</Button>
        </div>
      </div>
      )}

      {activeStep === 1 && (
        <div>
          <Typography variant="body2" color="textSecondary">변경할 비밀번호를 입력해주세요!</Typography>

          {/* 비밀번호 변경 실패 알림 */}
          {changeFailError && <Alert severity="error">{changeFailError}</Alert>}

          <div style={{ marginTop: 16, marginBottom: 16 }}>
            <TextField
              autoFocus
              label="새로운 비밀번호"
              fullWidth
              variant="filled"
              value={newPw.value}
              error={!!(newPw.value && !passwdErrorCheck(newPw.value))}
              helperText="특수문자 !@#$%^*+=- 를 포함한 8-20자 영문 또는 숫자"
              type={newPwVisibility.toggle ? 'text' : 'password'}
              onChange={newPw.handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={newPwVisibility.handleToggle}
                    >
                      {newPwVisibility.toggle ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </div>
          <div style={{ marginTop: 16, marginBottom: 16 }}>
            <TextField
              label="새로운 비밀번호 확인"
              fullWidth
              variant="filled"
              type={newPwCheckVisibility.toggle ? 'text' : 'password'}
              error={newPw.value !== newPwCheck.value}
              helperText={newPwCheck && (newPw.value !== newPwCheck.value) ? '입력한 두 비밀번호가 다릅니다.' : ''}
              value={newPwCheck.value}
              onChange={newPwCheck.handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={newPwCheckVisibility.handleToggle}
                    >
                      {newPwCheckVisibility.toggle ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </div>
          <div style={{ textAlign: 'right' }}>
            <Button
              style={{ marginLeft: 4 }}
              variant="contained"
              color="primary"
              disabled={!newPw.value || newPw.value !== newPwCheck.value}
              onClick={handleSubmit}
            >
              변경하기
            </Button>
            <Button style={{ marginLeft: 4 }} onClick={handleDialogClose} variant="contained">취소</Button>
          </div>
        </div>
      )}
    </CustomDialog>
  );
}
