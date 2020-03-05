import React, { useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Card from '../../../atoms/Card/Card';
import CardAvatar from '../../../atoms/Card/CardAvatar';
import CardBody from '../../../atoms/Card/CardBody';
import Button from '../../../atoms/CustomButtons/Button';
import CircularProgress from '../../../atoms/Progress/CircularProgress';
import Contract from './Contract/Contract';
import Dialog from '../../../atoms/Dialog/Dialog';
import Snackbar from '../../../atoms/Snackbar/Snackbar';
import IpChanger from './Ip/IpChanger';
import StyledItemText from '../../../atoms/StyledItemText';
import history from '../../../history';
import axios from '../../../utils/axios';
import HOST from '../../../utils/config';

const useStyles = makeStyles((theme) => ({
  textField: {
    width: '100%',
  },
  cardTitle: {
    color: theme.palette.info.main,
    textAlign: 'center',
    marginTop: '0px',
    fontWeight: '700',
  },
}));

const ProfileCard = (props) => {
  const classes = useStyles();
  const [ContractionOpen, setContractionOpen] = useState(false);
  const [IpChangerOpen, setIpChangerOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const { profileData } = props;

  function handleContractionOpen() {
    if (profileData.payload.result.creatorContractionAgreement === 1) {
      setContractionOpen(true);
    }
  }

  function handleContractionClose() {
    setContractionOpen(false);
  }

  function handleIpChangerOpen() {
    setIpChangerOpen(true);
  }

  function handleIpChangerClose() {
    setIpChangerOpen(false);
  }


  const handleProfileChange = (event) => {
    event.preventDefault();
    if (profileData.payload.result.creatorContractionAgreement === 1) {
      axios.get(`${HOST}/api/login/logout`)
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
        {profileData.loading && (<CircularProgress small />)}
        {!profileData.loading && !profileData.error && (
        <a href="#pablo" onClick={(e) => e.preventDefault()}>
          <img src={profileData.payload.result.creatorLogo} alt="..." />
        </a>
        )}
      </CardAvatar>
      {profileData.loading && (<CircularProgress small />)}
      {!profileData.loading && !profileData.error && (
        <CardBody profile>
          <StyledItemText
            primary={`${profileData.payload.result.creatorName} 님의 정보`}
            fontSize="18px"
            style={{ margin: '16px 0' }}
          />
          <Grid container direction="row" spacing={2} justify="center">
            <Grid item sm={12} md={9}>
              <TextField
                label="EMAIL"
                value={profileData.payload.result.creatorMail || ''}
                className={classes.textField}
                margin="normal"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item sm={12} md={9}>
              <Grid container direction="row" spacing={1}>
                <Grid item sm={12} md={6}>
                  <TextField
                    label="등록된 IP"
                    value={profileData.payload.result.creatorIp || ''}
                    className={classes.textField}
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item sm={12} md={6}>
                  <Button
                    color="blueGray"
                    size="medium"
                    style={{ marginTop: 20, float: 'left' }}
                    onClick={handleIpChangerOpen}
                  >
                    IP 변경하기
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={12} md={9}>
              <Grid container direction="row" spacing={1}>
                <Grid item sm={12} md={6}>
                  <TextField
                    label="계약상태"
                    value={profileData.payload.result.creatorContractionAgreement === 1 ? '계약완료' : '미계약'}
                    className={classes.textField}
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item sm={6} md={6}>
                  <Button
                    color="blueGray"
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
                정보 변경하러가기
              </Button>
            </Grid>
          </Grid>
        </CardBody>
      )}
      <Dialog
        open={ContractionOpen}
        onClose={handleContractionClose}
        fullWidth
        maxWidth="lg"
      >
        <Contract />
      </Dialog>
      {!profileData.loading && !profileData.error && (
      <Dialog
        open={IpChangerOpen}
        onClose={handleIpChangerClose}
        title="ip변경하기"
        fullWidth
        maxWidth="sm"
      >
        <IpChanger
          localIp={profileData.payload.result.creatorIp}
          NowIp={profileData.payload.result.NowIp}
          onClose={handleIpChangerClose}
        />
      </Dialog>
      )}
      <Snackbar
        place="tr"
        color="success"
        message="성공적으로 계약이 완료되었습니다."
        open={snackOpen}
        icon
        closeNotification={() => {
          setSnackOpen(false);
          history.push('/dashboard/creator/user');
        }}
        close
      />
    </Card>
  );
};

export default ProfileCard;
