import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
// core components
import GridItem from '../../../components/Grid/GridItem';
import GridContainer from '../../../components/Grid/GridContainer';
import CustomInput from '../../../components/CustomInput/CustomInput';
import Button from '../../../components/CustomButtons/Button';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardAvatar from '../../../components/Card/CardAvatar';
import CardBody from '../../../components/Card/CardBody';
import CardFooter from '../../../components/Card/CardFooter';
import AccountNumberForm from '../IncomeManage/AccountNumberForm';


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
    borderColor: 'linear-gradient(60deg, #ab47bc, #8e24aa)',
  },
};

const CssTextField = withStyles({
  root: {
    color: '#9c27b0',
    borderColor: '#9c27b0',
    '& .MuiFormLabel-root ': {
      color: '#9c27b0',
    },
    '& .MuiInputBase-input:before': {
      color: '#9c27b0',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#9c27b0',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#9c27b0',
      },
      '&:hover fieldset': {
        borderColor: '#9c27b0',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#9c27b0',
      },
    },
  },
})(TextField);

function UserProfile(props) {
  const { classes } = props;

  const [value, setValue] = useState('...');
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

  const UserContract = () => {
    if (userData.creatorName === value) {
      axios.post('/dashboard/creator/contraction', {
      })
        .catch((err) => {
          console.log(`계약과정오류${err}`);
        });
      props.history.push('/dashboard/main');
    } else {
      alert('서명이 올바르지 않습니다.');
    }
  };


  function handleChange(e) {
    setValue(e.target.value);
  }

  return (
    <div>
      <GridContainer>
        {/* 계약페이지 */}
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Contraction</h4>
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardCategory} style={{ textAlign: 'center' }}>거래계약서</h4>
              {/* user 이름 ......에 넣기 */}
              <h6 className={classes.cardTitle} style={{ textAlign: 'center' }}>
                거래 대상 OnAD 와 상기인
                {' '}
                {value}
              </h6>
              <p>
                OnAD와 { userData.creatorContractionAgreement === 0 ? (`${value}`) : (userData.creatorName) }
                간의 거래관계에 있어 서로 거래질서를 준수하고 상호 간 발전과 이익을 증진시키기 위하여 아래 조항들을 준수할 것을 약정한다.
              </p>
              <p>
                제 1조(목적) 본 계약은 OnAD와 { userData.creatorContractionAgreement === 0 ? (`${value}`) : (userData.creatorName) }
                상호간에 플랫폼의 계속적인 계약에 관한 제반 사항을 정하여 서로가 성실히 이행하며, 공동의 이익을 도모함을 목적으로 한다.
              </p>
              <p>
                제 2조(플랫폼 이용) OnAD는 플랫폼 이용 또는 온라인 서비스를 능력의 범위 내에서 { userData.creatorContractionAgreement === 0 ? (`${value}`) : (userData.creatorName) }
                에게 성실히 제공하여야 하며, { userData.creatorContractionAgreement === 0 ? (`${value}`) : (userData.creatorName) }는 OnAD의 서비스를 악의적인 용도로 사용하지 않는다.
              </p>
              <p>
                제 3조(이용책임) { userData.creatorContractionAgreement === 0 ? (`${value}`) : (userData.creatorName) }는
                악의적인 플랫폼 이용으로 인하여 책임 사항이 발생시 모두 본인이 책임지며 이를 선언한다.
              </p>
              <p>
                제 4조(기타) 이 계약서에 기재되지 아니한 사항은 서비스의 이용약관 및 개인정보처리 방침 사항을 따른다.
              </p>

            </CardBody>
            {/* 여기에서 ContractState값을 데이터베이스테서 가져와서 비교를 해야됨 */}
            { userData.creatorContractionAgreement === 0 ? (
              <div>
                <CustomInput
                  labelText="계약에 동의한다면 상기인의 서명을 입력하세요"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    multiline: true,
                    onChange: handleChange,
                    rows: 1,
                  }}
                />
                <CardFooter>
                  <Button color="primary" onClick={UserContract}>계약하기</Button>
                </CardFooter>
              </div>
            ) : (
              <CardFooter>
                <Button color="primary">계약완료</Button>
              </CardFooter>
            )}
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={5}>
          <Card>
            <CardHeader color="primary">
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
              <AccountNumberForm />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={1} />
        <GridItem xs={12} sm={12} md={5}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={userData.creatorLogo} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h4 className={classes.cardTitle}>
                {userData.creatorName}
                {' '}
님의 정보
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

              <Button color="primary" href="https://www.twitch.tv/settings/profile" round>
                정보변경
              </Button>
            </CardBody>
          </Card>
        </GridItem>

      </GridContainer>
    </div>
  );
}

export default withStyles(styles)(UserProfile);
