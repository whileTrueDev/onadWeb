import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
// core components
import GridItem from '../../../components/Grid/GridItem';
import GridContainer from '../../../components/Grid/GridContainer';
import Button from '../../../components/CustomButtons/Button';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardBody from '../../../components/Card/CardBody';
import AccountNumberForm from '../IncomeManage/AccountNumberForm';
import Contraction from './Contraction';

const styles = {
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
  contentWrapper: {
    margin: '20px 0px 20px 0px',
  },

  contentDetail: {
    marginTop: '5px',
    marginLeft: '20px',
  },
  textField: {
    width: '100%',
    borderColor: 'linear-gradient(60deg, #00acc1, #26c6da)',
  },
};

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

function UserProfile(props) {
  const { classes, history } = props;
  const [userData, setuserData] = useState({});

  const readyCreatorData = useCallback(() => {
    axios.get('/dashboard/creator/profile')
      .then((res) => {
        const user = res.data.result[0];
        setuserData(user);
      });
  }, []);

  useEffect(() => {
    readyCreatorData();
  }, [readyCreatorData]);

  return (
    <div>
      {/* 계약 컴포넌트 */}
      {userData.creatorContractionAgreement === 0
      && (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="blueGray">
              <h4 className={classes.cardTitleWhite}>서비스 이용 및 출금 계약하기</h4>
            </CardHeader>
            <CardBody>
              <Contraction history={history} />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      )}

      {/* 계정 관리 컴포넌트 */}
      <GridContainer>
        <GridItem xs={12} sm={12} md={5}>
          <Card>
            <CardHeader color="info">
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
              <Divider />
              <Typography variant="subtitle1" id="select-account" className={classes.contentTitle}>
                계좌 재입력
              </Typography>
              <AccountNumberForm history={history} />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={1} />
        <GridItem xs={12} sm={12} md={5}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                {/* <img src={userData.creatorLogo} alt="..." /> */}
                <img />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h4 className={classes.cardTitle}>
                {`${userData.creatorName} 님의 정보`}
              </h4>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CssTextField
                    label="TWITCH 고유 ID"
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
                    label="MAIL"
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
                <GridItem xs={12} sm={12} md={12}>
                  <CssTextField
                    label="IP"
                    value={userData.creatorIp || ''}
                    className={classes.textField}
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </GridItem>
              </GridContainer>

              {userData.creatorContractionAgreement === 1 && (
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
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
                {/* <GridItem xs={12} sm={12} md={6}>
                  <Button color="blueGray" style={{ marginTop: 20, float: 'left' }}>
                      계약서 보기
                  </Button>
                </GridItem> */}
              </GridContainer>
              )}

              <Button color="info" href="https://www.twitch.tv/settings/profile" round>
                정보변경하러가기
              </Button>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

UserProfile.propTypes = {
  classes: PropTypes.object,
  history: PropTypes.object,
};

export default withStyles(styles)(UserProfile);
