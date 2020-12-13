import React, { useState } from 'react';
import {
  Grid, TextField, Avatar, Typography, Paper, Divider
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Card from '../../../../atoms/Card/Card';
import CardAvatar from '../../../../atoms/Card/CardAvatar';
import CardBody from '../../../../atoms/Card/CardBody';
import Button from '../../../../atoms/CustomButtons/Button';
import StyledItemText from '../../../../atoms/StyledItemText';

import Contract from './Contract/Contract';
import { ProfileDataType } from './ProfileData.type';
import history from '../../../../history';
import axios from '../../../../utils/axios';
import HOST from '../../../../config';

const useStyles = makeStyles((theme) => ({
  textField: { width: '100%' },
  cardTitle: {
    color: theme.palette.info.main,
    textAlign: 'center',
    marginTop: '0px',
    fontWeight: 700,
  },
}));

interface ProfileCardProps {
  profileData: ProfileDataType;
}
function ProfileCard({ profileData }: ProfileCardProps): JSX.Element {
  const classes = useStyles();

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

  const handleProfileChange = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    if (profileData.creatorContractionAgreement === 1) {
      axios.get(`${HOST}/logout`)
        .then(() => {
          window.location.href = 'https://www.twitch.tv/settings/profile';
        })
        .catch(() => {
          history.push('/');
        });
    }
  };

  return (
    <>
      <Paper style={{ padding: 32 }}>
        <Grid container>
          <Typography style={{ fontWeight: 'bold' }}>플랫폼 연동</Typography>
          <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
            <img alt="" height={35} src="/pngs/logo/twitch/TwitchGlitchPurple.png" />
            <Button variant="contained" size="small">연동하기</Button>
          </Grid>
          <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
            <img alt="" height={35} src="/pngs/logo/afreeca/onlyFace.png" />
            <Button variant="contained" size="small">연동하기</Button>
          </Grid>

          <Typography style={{ fontWeight: 'bold' }}>내 정보 관리</Typography>
          <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
            <Typography style={{ marginRight: 16, minWidth: 75 }}>프로필사진</Typography>
            <Avatar src={profileData.creatorLogo} style={{ width: 45, height: 45 }} />
          </Grid>
          <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
            <Typography style={{ marginRight: 16, minWidth: 75 }}>아이디</Typography>
            <TextField />
          </Grid>
          <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
            <Typography style={{ marginRight: 16, minWidth: 75 }}>비밀번호</Typography>
            <TextField />
          </Grid>
          <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
            <Typography style={{ marginRight: 16, minWidth: 75 }}>계약상태</Typography>
            <TextField
              value={profileData.creatorContractionAgreement === 1 ? '계약완료' : '미계약'}
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            <Button
              size="small"
              style={{ marginTop: 20, float: 'left' }}
              onClick={handleContractionOpen}
            >
              계약서 보기
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Contract open={ContractionOpen} handleClose={handleContractionClose} />
    </>
  );
}

export default ProfileCard;
