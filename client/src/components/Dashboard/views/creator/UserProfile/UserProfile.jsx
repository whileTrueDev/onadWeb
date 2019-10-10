import React, { useState, useEffect, useCallback } from 'react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import axios from '../../../../../utils/axios';
// core components
import GridItem from '../../../components/Grid/GridItem';
import GridContainer from '../../../components/Grid/GridContainer';
import Button from '../../../components/CustomButtons/Button';
import Card from '../../../components/Card/Card';
import CardAvatar from '../../../components/Card/CardAvatar';
import CardHeader from '../../../components/Card/CardHeader';
import CardBody from '../../../components/Card/CardBody';
import Snackbar from '../../../components/Snackbar/Snackbar';
import AccountNumberForm from '../IncomeManage/AccountNumberForm';
import Contraction from './Contraction';
import CompletedContract from './CompletedContract';
import Dialog from '../../../components/Dialog/Dialog';
import HOST from '../../../../../config';
import IpChanger from './IpChanger';
import history from '../../../../../history';
import Table from '../../../components/Table/NotificationTable';

const styles = theme => ({
  cardCategoryWhite: {
    color: 'rgba(255,255,255,.62)',
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0',
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', 'Nanum Gothic', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
  },
  dialogTitle: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    marginBottom: '3px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
    },
  },
  contentWrapper: {
    margin: '20px 0px 20px 0px',
  },
  contentDetail: {
    marginTop: '5px',
    marginLeft: '20px',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', 'Nanum Gothic', sans-serif",
    fontWeight: 900,
  },
  textField: {
    width: '100%',
    borderColor: 'linear-gradient(60deg, #00acc1, #26c6da)',
  },
});

const CssTextField = withStyles({
  root: {
    color: '#00acc1',
    borderColor: '#00acc1',
    '& .MuiFormLabel-root ': {
      color: '#00acc1',
    },
    '& .MuiInputBase-input:before': {
      color: '#00acc1',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#00acc1',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#00acc1',
      },
      '&:hover fieldset': {
        borderColor: '#00acc1',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#00acc1',
      },
    },
  },
})(TextField);

function useDialog() {
  // 계약서 다이얼로그 띄우기
  const [ContractionOpen, setContractionOpen] = useState(false);
  const [IpChangerOpen, setIpChangerOpen] = useState(false);
  function handleContractionOpen() {
    setContractionOpen(true);
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

  return {
    ContractionOpen, handleContractionOpen, handleContractionClose, IpChangerOpen, handleIpChangerOpen, handleIpChangerClose,
  };
}

function UserProfile(props) {
  const { classes } = props;
  const [userData, setuserData] = useState({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [notificationArray, setNotificationArray] = useState([['', '', '', '']]);
  const {
    ContractionOpen,
    handleContractionOpen,
    handleContractionClose,
    IpChangerOpen,
    handleIpChangerOpen,
    handleIpChangerClose,
  } = useDialog();

  const readyCreatorData = useCallback(() => {
    axios.get(`${HOST}/api/dashboard/creator/profile`)
      .then((res) => {
        if (res.data.error) {
          history.push('/');
        } else {
          setuserData(res.data.result);
        }
      });
  }, []);

  const handleProfileChange = (event) => {
    event.preventDefault();
    axios.get(`${HOST}/api/login/logout`)
      .then(() => {
        window.location.href = 'https://www.twitch.tv/settings/profile';
      })
      .catch(() => {
        history.push('/');
      });
  };
  const notificationList = () => {
    axios.get(`${HOST}/api/dashboard/creator/notification/list`)
      .then((res) => {
        setNotificationArray(res.data);
      });
  };
  useEffect(() => {
    readyCreatorData();
    notificationList();
  }, [readyCreatorData]);

  return (
    <div>
      {/* 계약 컴포넌트 */}
      {userData.creatorContractionAgreement === 0 && (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12} lg={9} xl={8}>
          <Card>
            <CardHeader color="blueGray">
              <h4 className={classes.cardTitleWhite}>서비스 이용 및 출금 계약하기</h4>
            </CardHeader>
            <CardBody>
              <Contraction history={history} setSnackOpen={setSnackOpen} />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      )}

      {/* 계정 관리 컴포넌트 */}
      <GridContainer>
        <GridItem xs={12} sm={12} md={6} lg={4}>
          <Card>
            <CardHeader color="blueGray">
              <h4 className={classes.cardTitleWhite}>계좌관리</h4>
              <p className={classes.cardCategoryWhite}>내 계좌를 관리합니다.</p>
            </CardHeader>
            <CardBody>
              <div className={classes.contentWrapper}>
                <Typography variant="subtitle1" id="select-account" className={classes.contentTitle}>
                현재 등록된 계좌
                </Typography>
                <Typography
                  id="select-account"
                  className={classes.contentDetail}
                >
                  {userData.creatorAccountNumber ? `${userData.creatorAccountNumber.split('_')[0]}   ${userData.creatorAccountNumber.split('_')[1]}` : '현재 등록된 계좌가 존재하지 않습니다.'}
                </Typography>
              </div>
              <Divider style={{ marginBottom: '15px' }} />
              <Typography variant="subtitle1" id="select-account" className={classes.contentTitle}>
                계좌 재입력
              </Typography>
              <AccountNumberForm history={history} />
            </CardBody>
          </Card>
        </GridItem>
        <Hidden mdDown>
          <GridItem md={1} />
        </Hidden>
        <GridItem xs={12} sm={12} md={6} lg={4} xl={3}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={userData.creatorLogo} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h4 className={classes.cardTitle}>
                {`${userData.creatorName} 님의 정보`}
              </h4>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CssTextField
                    label="TWITCH ID"
                    value={userData.creatorId || ''}
                    className={classes.textField}
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CssTextField
                    label="NAME"
                    value={userData.creatorName || ''}
                    className={classes.textField}
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </GridItem>

              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CssTextField
                    label="EMAIL"
                    value={userData.creatorMail || ''}
                    className={classes.textField}
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CssTextField
                    label="등록된 IP"
                    value={userData.creatorIp || ''}
                    className={classes.textField}
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <Button
                    color="blueGray"
                    style={{ marginTop: 20, float: 'left' }}
                    onClick={handleIpChangerOpen}
                  >
                      IP 변경하기
                  </Button>
                </GridItem>

              </GridContainer>

              {userData.creatorContractionAgreement === 1 && (
              <GridContainer>
                <GridItem xs={6} sm={6} md={6}>
                  <CssTextField
                    label="계약상태"
                    value="계약완료"
                    className={classes.textField}
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={6} sm={6} md={6}>
                  <Button
                    color="blueGray"
                    style={{ marginTop: 20, float: 'left' }}
                    onClick={handleContractionOpen}
                  >
                    계약서 보기
                  </Button>
                </GridItem>
              </GridContainer>
              )}

              <Button color="info" onClick={handleProfileChange}>
                정보변경하러가기
              </Button>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="blueGray">
              <h4 className={classes.cardTitleWhite}>내 모든 알림내역</h4>
              <p className={classes.cardCategoryWhite}>내 모든 알림내역을 보여줍니다.</p>
            </CardHeader>
            <CardBody>
              <Table
                tableHead={['제목', '내용', '날짜', '확인']}
                tableData={notificationArray}
                pagination
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      {/* 계약 완료시, 완료된 약관 보기 */}
      {userData.creatorContractionAgreement === 1 && (
        <Dialog
          open={ContractionOpen}
          onClose={handleContractionClose}
          fullWidth
          maxWidth="md"
        >
          <Card>
            <CardHeader color="blueGray">
              <h4 className={classes.dialogTitle}>서비스 이용 및 출금 계약하기</h4>
            </CardHeader>
            <CardBody>
              <CompletedContract />
            </CardBody>
          </Card>
        </Dialog>
      )}
      <Dialog
        open={IpChangerOpen}
        onClose={handleIpChangerClose}
        title="ip변경하기"
        fullWidth
        maxWidth="sm"
      >
        <IpChanger
          classes={classes}
          localIp={userData.localIp}
          styles={styles}
          CssTextField={CssTextField}
          onClose={handleIpChangerClose}
          history={history}
        />
      </Dialog>
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
    </div>
  );
}


export default withStyles(styles)(UserProfile);
