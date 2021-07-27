import { Box, Button, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useHistory } from 'react-router-dom';
import CustomDialog from '../../../../../atoms/Dialog/Dialog';
import { useDialog } from '../../../../../utils/hooks';
import { useCreatorSignoutMutation } from '../../../../../utils/hooks/mutation/useCreatorSignoutMutation';
import { useLogoutMutation } from '../../../../../utils/hooks/mutation/useLogoutMutation';
import { useCreatorProfile } from '../../../../../utils/hooks/query/useCreatorProfile';
import PasswordConfirmDialog from './PasswordConfirmDialog';

interface SignoutConfirmDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SignoutConfirmDialog({
  open,
  onClose,
}: SignoutConfirmDialogProps): React.ReactElement {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const profile = useCreatorProfile();
  const signout = useCreatorSignoutMutation();
  const logout = useLogoutMutation();

  const checkPwDialog = useDialog();

  async function handleSignout() {
    if (window.confirm('정말로 탈퇴하시겠습니까?')) {
      const res = await signout.mutateAsync();
      if (!res.data) {
        enqueueSnackbar('회원탈퇴에 실패했습니다. 지속적으로 문제가 발견될 경우, 문의바랍니다.', {
          variant: 'error',
        });
      } else {
        logout.mutate();
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
              // disabled={!!profile.data?.creatorTwitchOriginalId || !!profile.data?.afreecaId}
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

      {(!!profile.data?.creatorTwitchOriginalId || !!profile.data?.afreecaId) && (
        <Alert severity="error">
          플랫폼(트위치/아프리카) 연동되어 있는 경우 탈퇴가 불가능합니다.
        </Alert>
      )}

      <PasswordConfirmDialog
        open={checkPwDialog.open}
        onClose={checkPwDialog.handleClose}
        onSubmit={handleSignout}
      />
    </CustomDialog>
  );
}
