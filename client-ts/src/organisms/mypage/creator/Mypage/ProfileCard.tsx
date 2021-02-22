import React, { useState } from 'react';
import {
  Grid, TextField, Avatar, Typography, Paper
} from '@material-ui/core';
import { OpenInNew } from '@material-ui/icons';
import Button from '../../../../atoms/CustomButtons/Button';
import Snackbar from '../../../../atoms/Snackbar/Snackbar';

import Contract from './Contract/Contract';
import { ProfileDataType } from './ProfileData.type';
import PasswordDialog from './ProfileChangeDIalog/PasswordDialog';
import { useDialog } from '../../../../utils/hooks';

interface ProfileCardProps {
  profileData: ProfileDataType;
}
function ProfileCard({ profileData }: ProfileCardProps): JSX.Element {
  // ***************************************************
  // 계약서 보기
  const [ContractionOpen, setContractionOpen] = useState(false);
  function handleContractionOpen(): void {
    if (profileData.creatorContractionAgreement === 1) {
      setContractionOpen(true);
    }
  }
  function handleContractionClose(): void {
    setContractionOpen(false);
  }

  // ***************************************************
  // 텍스트필드 컴포넌트
  interface TextFieldWithLabelProps {
    title: string; children: React.ReactNode;
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
  const successSnack = useDialog();

  return (
    <>
      <Paper style={{ padding: 32, marginTop: 8 }}>
        <Grid container style={{ paddingTop: 16, paddingBottom: 16 }} alignItems="center">
          <Typography style={{ fontWeight: 'bold', marginBottom: 8 }}>내 정보 관리</Typography>

          <TextFieldWithLabel title="프로필사진">
            <Avatar src={profileData.creatorLogo || profileData.afreecaLogo || ''} style={{ width: 45, height: 45 }} />
          </TextFieldWithLabel>

          <TextFieldWithLabel title="아이디">
            <TextField
              InputProps={{ style: { padding: 0 } }}
              value={profileData.loginId}
              disabled
            />
          </TextFieldWithLabel>

          <TextFieldWithLabel title="비밀번호">
            <TextField InputProps={{ style: { padding: 0 } }} value="****" disabled />
            <Button size="small" style={{ marginLeft: 16 }} onClick={passwordDialog.handleOpen}>
              <OpenInNew fontSize="small" style={{ verticalAlign: 'middle' }} />
              변경하기
            </Button>
          </TextFieldWithLabel>

          <TextFieldWithLabel title="이용동의상태">
            <TextField
              value={profileData.creatorContractionAgreement === 1 ? '이용동의완료✔️' : '미동의'}
              margin="normal"
              disabled
              InputProps={{ readOnly: true, style: { padding: 0 } }}
            />
            {profileData.creatorContractionAgreement === 1 && (
            <Button
              size="small"
              style={{ marginLeft: 16 }}
              onClick={handleContractionOpen}
            >
              <OpenInNew fontSize="small" style={{ verticalAlign: 'middle' }} />
              이용약관 보기
            </Button>
            )}
          </TextFieldWithLabel>
        </Grid>
      </Paper>

      {/* 비밀번호 변경 폼 다이얼로그 */}
      <PasswordDialog
        open={passwordDialog.open}
        onClose={passwordDialog.handleClose}
        handleSnackOpen={successSnack.handleOpen}
      />
      {/* 비밀번호 변경 성공 스낵바 */}
      <Snackbar
        message="성공적으로 비밀번호를 변경했습니다."
        color="success"
        open={successSnack.open}
        onClose={successSnack.handleClose}
      />

      {/* 계약서 다이얼로그 */}
      <Contract open={ContractionOpen} handleClose={handleContractionClose} />
    </>
  );
}

export default ProfileCard;
