import { Box, TextField, Typography, Button } from '@material-ui/core';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import CustomDialog from '../../../../../atoms/Dialog/Dialog';
import { usePostRequest } from '../../../../../utils/hooks';

interface PasswordConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

interface PasswordForm {
  password: string;
}

export default function PasswordConfirmDialog({
  open,
  onClose,
  onSubmit,
}: PasswordConfirmDialogProps): React.ReactElement {
  const checkPw = usePostRequest('/creator/password');

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<PasswordForm>();
  const checkPasswordSubmit: SubmitHandler<PasswordForm> = async data => {
    const res = await checkPw.doPostRequest({ password: data.password });
    if (res.data) {
      onClose();
      reset();
      return onSubmit();
    }
    return setError('password', { message: '비밀번호가 올바르지 않습니다.' });
  };

  return (
    <CustomDialog title="비밀번호 확인" fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(checkPasswordSubmit)}>
        <Box my={1}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                fullWidth
                placeholder="비밀번호를 입력하세요."
                type="password"
                label="비밀번호 확인"
                error={!!errors.password?.message}
              />
            )}
          />
          {errors.password && (
            <Typography variant="body2" color="error">
              {errors.password.message}
            </Typography>
          )}
        </Box>

        <Box display="flex" alignItems="center" justifyContent="flex-end" my={1}>
          <Box mr={1}>
            <Button variant="contained" color="primary" type="submit" disabled={checkPw.loading}>
              확인
            </Button>
          </Box>
          <Button onClick={onClose}>취소</Button>
        </Box>
      </form>
    </CustomDialog>
  );
}
