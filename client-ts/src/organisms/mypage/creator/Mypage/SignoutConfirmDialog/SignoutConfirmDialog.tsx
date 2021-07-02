import { Box, Button, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { useHistory } from 'react-router-dom';
import CustomDialog from '../../../../../atoms/Dialog/Dialog';
import Snackbar from '../../../../../atoms/Snackbar/Snackbar';
import { useDeleteRequest, useDialog, usePostRequest } from '../../../../../utils/hooks';
import { ProfileDataType } from '../ProfileData.type';
import PasswordConfirmDialog from './PasswordConfirmDialog';

interface SignoutConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  profileData: ProfileDataType;
}

export default function SignoutConfirmDialog({
  open,
  onClose,
  profileData,
}: SignoutConfirmDialogProps): React.ReactElement {
  const history = useHistory();
  const signout = useDeleteRequest('/creator');
  const logout = usePostRequest('/logout');
  const checkPwDialog = useDialog();
  const failsnack = useDialog();

  async function handleSignout() {
    if (window.confirm('정말로 탈퇴하시겠습니까?')) {
      const res = await signout.doDeleteRequest();
      if (!res.data) {
        failsnack.handleOpen();
      } else {
        await logout.doPostRequest();
        history.push('/');
      }
    }
  }

  return (
    <CustomDialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={onClose}
      title="방송인 회원탈퇴"
      buttons={
        <Box display="flex" alignItems="center">
          <Box mr={1}>
            <Button
              onClick={checkPwDialog.handleOpen}
              disabled={!!profileData.creatorTwitchOriginalId || !!profileData.afreecaId}
            >
              확인
            </Button>
          </Box>
          <Button variant="contained" color="primary" onClick={onClose}>
            취소
          </Button>
        </Box>
      }
    >
      <Box my={1}>
        <Typography>회원탈퇴시 보유한 수익금은 모두 사라지며, 되돌릴 수 없습니다.</Typography>
      </Box>

      {(!!profileData.creatorTwitchOriginalId || !!profileData.afreecaId) && (
        <Alert severity="error">
          플랫폼(트위치/아프리카) 연동되어 있는 경우 탈퇴가 불가능합니다.
        </Alert>
      )}

      <PasswordConfirmDialog
        open={checkPwDialog.open}
        onClose={checkPwDialog.handleClose}
        onSubmit={handleSignout}
      />

      {failsnack.open && (
        <Snackbar
          open={failsnack.open}
          onClose={failsnack.handleClose}
          message="회원탈퇴에 실패했습니다. 지속적으로 문제가 발견될 경우, 문의바랍니다."
          color="error"
        />
      )}
    </CustomDialog>
  );
}
