import { Avatar, Button, Grid, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import { OpenInNew } from '@material-ui/icons';
import React, { useState, ReactNode } from 'react';
import { useSnackbar } from 'notistack';
import CenterLoading from '../../../../atoms/Loading/CenterLoading';

import { useDialog } from '../../../../utils/hooks';
import { useCreatorProfile } from '../../../../utils/hooks/query/useCreatorProfile';
import Contract from './Contract/Contract';
import PasswordDialog from './ProfileChangeDIalog/PasswordDialog';
import SignoutConfirmDialog from './SignoutConfirmDialog/SignoutConfirmDialog';

const useStyles = makeStyles(() => ({
  linkText: {
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
}));
function ProfileCard(): React.ReactElement {
  // 프로필 유저 데이터
  const profile = useCreatorProfile();

  const classes = useStyles();
  // ***************************************************
  // 계약서 보기
  const [ContractionOpen, setContractionOpen] = useState(false);
  function handleContractionOpen(): void {
    if (profile.data?.creatorContractionAgreement === 1) {
      setContractionOpen(true);
    }
  }
  function handleContractionClose(): void {
    setContractionOpen(false);
  }

  // ***************************************************
  // 텍스트필드 컴포넌트
  interface TextFieldWithLabelProps {
    title: string;
    children: ReactNode;
  }
  const TextFieldWithLabel = ({ title, children }: TextFieldWithLabelProps): JSX.Element => (
    <Grid item xs={12} style={{ display: 'flex', alignItems: 'center', minHeight: 40 }}>
      <Typography style={{ marginRight: 16, minWidth: 100 }}>{title}</Typography>
      {children}
    </Grid>
  );

  // **************************************************
  // 비밀번호 변경 다이얼로그
  const passwordDialog = useDialog();

  // ***************************************************
  // 비밀번호 변경 성공 알림 스낵바
  const { enqueueSnackbar } = useSnackbar();

  // ***************************************************
  // 회원 탈퇴 확인 다이얼로그
  const signoutConfirmDialog = useDialog();

  if (profile.isLoading) return <CenterLoading />;
  if (!profile.data) return <div />;

  return (
    <>
      <Paper style={{ padding: 32, marginTop: 8 }}>
        <Grid container style={{ paddingTop: 16, paddingBottom: 16 }} alignItems="center">
          <Typography style={{ fontWeight: 'bold', marginBottom: 8 }}>내 정보 관리</Typography>

          <TextFieldWithLabel title="프로필사진">
            <Avatar
              src={profile.data.creatorLogo || profile.data.afreecaLogo || ''}
              style={{ width: 45, height: 45 }}
            />
          </TextFieldWithLabel>

          <TextFieldWithLabel title="아이디">
            <TextField
              InputProps={{ style: { padding: 0 } }}
              value={profile.data.loginId}
              disabled
            />
          </TextFieldWithLabel>

          <TextFieldWithLabel title="비밀번호">
            <TextField InputProps={{ style: { padding: 0 } }} value="****" disabled />
            <Button
              variant="outlined"
              size="small"
              style={{ marginLeft: 16 }}
              onClick={passwordDialog.handleOpen}
            >
              <OpenInNew fontSize="small" style={{ verticalAlign: 'middle' }} />
              변경하기
            </Button>
          </TextFieldWithLabel>

          <TextFieldWithLabel title="이용동의상태">
            <TextField
              value={profile.data.creatorContractionAgreement === 1 ? '이용동의완료✔️' : '미동의'}
              margin="normal"
              disabled
              InputProps={{ readOnly: true, style: { padding: 0 } }}
            />
            {profile.data.creatorContractionAgreement === 1 && (
              <Button
                variant="outlined"
                size="small"
                style={{ marginLeft: 16 }}
                onClick={handleContractionOpen}
              >
                <OpenInNew fontSize="small" style={{ verticalAlign: 'middle' }} />
                이용약관 보기
              </Button>
            )}
          </TextFieldWithLabel>

          <Typography
            className={classes.linkText}
            color="textSecondary"
            variant="caption"
            onClick={() => signoutConfirmDialog.handleOpen()}
          >
            회원 탈퇴
          </Typography>
        </Grid>
      </Paper>

      {/* 비밀번호 변경 폼 다이얼로그 */}
      <PasswordDialog
        open={passwordDialog.open}
        onClose={passwordDialog.handleClose}
        handleSnackOpen={() =>
          enqueueSnackbar('성공적으로 비밀번호를 변경했습니다.', { variant: 'success' })
        }
      />

      {/* 계약서 다이얼로그 */}
      <Contract open={ContractionOpen} handleClose={handleContractionClose} />

      <SignoutConfirmDialog
        open={signoutConfirmDialog.open}
        onClose={signoutConfirmDialog.handleClose}
      />
    </>
  );
}

export default ProfileCard;
