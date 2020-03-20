import React, { useState } from 'react';
import { Grid, TextField, Avatar } from '@material-ui/core';
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
    <Card profile>
      <CardAvatar profile>
        <a href="#hi" onClick={(e): void => e.preventDefault()}>
          <img src={profileData.creatorLogo} alt="..." />
        </a>
      </CardAvatar>
      <CardBody profile>
        <StyledItemText
          primary={`${profileData.creatorName} 님의 정보`}
          fontSize="18px"
          style={{ margin: '16px 0' }}
        />
        <Grid container direction="row" spacing={2} justify="center">
          <Grid item xs={12} sm={9} md={9}>
            <TextField
              label="EMAIL"
              value={profileData.creatorMail || ''}
              className={classes.textField}
              margin="normal"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={9} md={9}>
            <Grid container direction="row" spacing={1} justify="flex-start">
              <Grid item xs={5} sm={9}>
                <TextField
                  label="계약상태"
                  value={profileData.creatorContractionAgreement === 1 ? '계약완료' : '미계약'}
                  className={classes.textField}
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={3} sm={3}>
                <Button
                  size="medium"
                  style={{ marginTop: 20, float: 'left' }}
                  onClick={handleContractionOpen}
                >
                  계약서 보기
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={12} md={9}>
            <Button color="primary" onClick={handleProfileChange}>

              정보 변경하러 가기
              <Avatar src="/pngs/logo/twitch.png" />

            </Button>
          </Grid>
        </Grid>
      </CardBody>

      <Contract open={ContractionOpen} handleClose={handleContractionClose} />
    </Card>
  );
}

export default ProfileCard;
