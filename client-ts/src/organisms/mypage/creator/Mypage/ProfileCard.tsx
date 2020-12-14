import React, { useState } from 'react';
import {
  Grid, TextField, Avatar, Typography, Paper, darken
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { OpenInNew } from '@material-ui/icons';
import Button from '../../../../atoms/CustomButtons/Button';

import Contract from './Contract/Contract';
import { ProfileDataType } from './ProfileData.type';
import HOST from '../../../../config';
import PasswordDialog from './ProfileChangeDIalog/PasswordDialog';
import { OnadTheme } from '../../../../theme';
import { useDialog } from '../../../../utils/hooks';

const useStyles = makeStyles((theme: OnadTheme) => ({
  textField: { width: '100%' },
  cardTitle: {
    color: theme.palette.info.main,
    textAlign: 'center',
    marginTop: '0px',
    fontWeight: 700,
  },
  twitch: {
    color: theme.palette.getContrastText(theme.palette.platform.twitch),
    backgroundColor: theme.palette.platform.twitch,
    '&:hover': { backgroundColor: darken(theme.palette.platform.twitch, 0.15) },
  },
  afreeca: {
    color: theme.palette.getContrastText(theme.palette.platform.afreeca),
    backgroundColor: theme.palette.platform.afreeca,
    '&:hover': { backgroundColor: darken(theme.palette.platform.afreeca, 0.15) },
  },
}));

interface ProfileCardProps {
  profileData: ProfileDataType;
}
function ProfileCard({ profileData }: ProfileCardProps): JSX.Element {
  const classes = useStyles();

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

  return (
    <>
      <Paper style={{ padding: 32 }}>
        <Grid container style={{ paddingBottom: 16 }} alignItems="center">
          <Grid item xs={12}>
            <Typography style={{ fontWeight: 'bold' }}>플랫폼 연동</Typography>
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>광고시작을 위해 플랫폼 연동은 꼭 필요합니다.</Typography>
          </Grid>
          <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
            <img alt="" height={35} src="/pngs/logo/twitch/TwitchGlitchPurple.png" style={{ marginRight: 16 }} />
            <Button
              variant="contained"
              size="small"
              className={classes.twitch}
              href={`${HOST}/link/twitch`}
            >
              트위치 연동하기
            </Button>
          </Grid>
          <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
            <img alt="" height={35} src="/pngs/logo/afreeca/onlyFace.png" style={{ marginRight: 16, filter: 'grayscale(100%)' }} />
            <Button
              variant="contained"
              size="small"
              className={classes.afreeca}
            >
              아프리카TV 연동하기
            </Button>
          </Grid>
        </Grid>

        <Grid container style={{ paddingTop: 16, paddingBottom: 16 }} alignItems="center">
          <Typography style={{ fontWeight: 'bold', marginBottom: 8 }}>내 정보 관리</Typography>

          <TextFieldWithLabel title="프로필사진">
            <Avatar src={profileData.creatorLogo} style={{ width: 45, height: 45 }} />
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
              <OpenInNew fontSize="small" />
              변경하기
            </Button>
          </TextFieldWithLabel>

          <TextFieldWithLabel title="이용동의상태">
            <TextField
              value={profileData.creatorContractionAgreement === 1 ? '이용동의완료' : '미동의'}
              margin="normal"
              disabled
              InputProps={{ readOnly: true, style: { padding: 0 } }}
            />
            <Button
              size="small"
              style={{ marginLeft: 16 }}
              onClick={handleContractionOpen}
            >
              <OpenInNew fontSize="small" />
              계약서 보기
            </Button>
          </TextFieldWithLabel>
        </Grid>
      </Paper>

      {/* 비밀번호 변경 폼 다이얼로그 */}
      <PasswordDialog open={passwordDialog.open} onClose={passwordDialog.handleClose} />

      {/* 계약서 다이얼로그 */}
      <Contract open={ContractionOpen} handleClose={handleContractionClose} />
    </>
  );
}

export default ProfileCard;
