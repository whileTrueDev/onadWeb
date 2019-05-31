import React, { useState, useEffect } from 'react';
import axios from 'axios';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import InputLabel from '@material-ui/core/InputLabel';
// core components
import avatar from '../../../assets/img/faces/marc.jpg';
import GridItem from '../../../components/Grid/GridItem';
import GridContainer from '../../../components/Grid/GridContainer';
import CustomInput from '../../../components/CustomInput/CustomInput';
import Button from '../../../components/CustomButtons/Button';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardAvatar from '../../../components/Card/CardAvatar';
import CardBody from '../../../components/Card/CardBody';
import CardFooter from '../../../components/Card/CardFooter';

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
};


// 임시데이터
const defaultIncomeData = {
  code: 0,
  creatorId: '',
  creatorName: '앙기모뛰',
  creatorTotalIncome: 0,
  creatorReceivable: 0,
  date: '',
};

const creatorId = '130096343';

function UserProfile(props) {
  const { classes } = props;

  // 대시보드에 필요한 데이터 임시적으로 사용
  const [data, setData] = useState(defaultIncomeData);

  // input값 얻기 위해
  const [value, setValue] = useState('...');

  useEffect(() => {
    console.log('데이터요청');
    axios.get('/dashboard/creator/income', {
      params: {
        creatorId,
      },
    }).then((res) => {
      setData(res.data);
    }).catch((res) => {
      console.log(res);
    });
  }, []);

  const UserContract = () => {
    if (data.creatorName === value) {
      console.log(data.creatorContractionAgreement);
      axios.post('/dashboard/creator/contraction', {
        creatorId,
      })
        .catch((err) => {
          console.log(`계약과정오류${err}`);
        });
      props.history.push('/dashboard/main');
    } else {
      alert('서명이 올바르지 않습니다.');
    }
  };

  // console.log(ContractState)
  function handleChange(e) {
    setValue(e.target.value);
  }

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
              <p className={classes.cardCategoryWhite}>Complete your profile</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={5}>
                  <CustomInput
                    labelText="Company (disabled)"
                    id="company-disabled"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      disabled: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText="Username"
                    id="username"
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Email address"
                    id="email-address"
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="First Name"
                    id="first-name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Last Name"
                    id="last-name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="City"
                    id="city"
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Country"
                    id="country"
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Postal Code"
                    id="postal-code"
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <InputLabel style={{ color: '#AAAAAA' }}>About me</InputLabel>
                  <CustomInput
                    labelText="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
                    id="about-me"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 5,
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary">Update Profile</Button>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={avatar} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h6 className={classes.cardCategory}>CEO / CO-FOUNDER</h6>
              <h4 className={classes.cardTitle}>Alec Thompson</h4>
              <p className={classes.description}>
                {`Don't be scared of the truth because we need to restart the
                human foundation in truth And I love you like Kanye loves Kanye
                I love Rick Owens’ bed design but the back is...`}
              </p>
              <Button color="primary" round>
                Follow
              </Button>
            </CardBody>
          </Card>
        </GridItem>

        {/* 계약페이지 */}
        <GridItem xs={12} sm={12} md={12}>
          <Card paper>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Contraction</h4>
            </CardHeader>
            <CardBody paper>
              <h4 className={classes.cardCategory} style={{ textAlign: 'center' }}>거래계약서</h4>
              {/* user 이름 ......에 넣기 */}
              <h6 className={classes.cardTitle} style={{ textAlign: 'center' }}>
거래 대상 OnAD 와 상기인
                {' '}
                {value}
                {' '}
              </h6>
              <p>
                OnAD와
                {' '}
                {value}
간의 거래관계에 있어 서로 거래질서를 준수하고 상호 간 발전과 이익을 증진시키기 위하여 아래 조항들을 준수할 것을 약정한다.
              </p>
              <p>
                제 1조(목적) 본 계약은 OnAD와
                {' '}
                {value}
                {' '}
상호간에 플랫폼의 계속적인 계약에 관한 제반 사항을 정하여 서로가 성실히 이행하며, 공동의 이익을 도모함을 목적으로 한다.
              </p>
              <p>
                제 2조(플랫폼 이용) OnAD는 플랫폼 이용 또는 온라인 서비스를 능력의 범위 내에서
                {' '}
                {value}
에게 성실히 제공하여야 하며,
                {' '}
                {value}
는 OnAD의 서비스를 악의적인 용도로
                사용하지 않는다.
              </p>
              <p>
                제 3조(이용책임)
                {' '}
                {value}
는 악의적인 플랫폼 이용으로 인하여 책임 사항이 발생시 모두 본인이 책임지며 이를 선언한다.
              </p>
              <p>
                제 4조(기타) 이 계약서에 기재되지 아니한 사항은 서비스의 이용약관 및 개인정보처리 방침 사항을 따른다.
              </p>
            </CardBody>
            {/* 여기에서 ContractState값을 데이터베이스테서 가져와서 비교를 해야됨 */}
            { data.creatorContractionAgreement === 0 ? (
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
                {' '}

              </div>
            ) : (
              <CardFooter>
                <Button color="primary">계약완료</Button>
              </CardFooter>
            )}
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default withStyles(styles)(UserProfile);
