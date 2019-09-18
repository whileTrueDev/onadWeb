import React, { useEffect, useState, useCallback } from 'react';
// for Link tag component
// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
import { TextField, MenuItem } from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import MaskedInput from 'react-text-mask';
import axios from '../../../../../../utils/axios';
import GridContainer from '../../../../components/Grid/GridContainer';
import GridItem from '../../../../components/Grid/GridItem';
import Card from '../../../../components/Card/Card';
import CardHeader from '../../../../components/Card/CardHeader';
import CardBody from '../../../../components/Card/CardBody';
import CardFooter from '../../../../components/Card/CardFooter';
import Button from '../../../../components/CustomButtons/Button';
import dashboardStyle from '../../../../assets/jss/onad/views/dashboardStyle';
import Snackbar from '../../../../components/Snackbar/Snackbar';
import HOST from '../../../../../../config';

dashboardStyle.textField = {
  width: '100%',
  marginTop: '15px',
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
};

const initialValue = {
  value: '',
  password: false,
  repasswd: false,
};
// reducer를 사용하여 Error를 handling하자
const myReducer = (state, action) => {
  switch (action.type) {
    case 'password': {
      const regx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
      if (regx.test(action.value)) {
        return { ...state, value: action.value, password: false };
      }
      return { ...state, value: action.value, password: true };
    }
    case 'repasswd': {
      if (state.value === action.value) {
        return { ...state, repasswd: false };
      }
      return { ...state, repasswd: true };
    }
    default: {
      return state;
    }
  }
};


const TextMaskCustom = (props) => {
  const { inputRef, ...other } = props;
  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={['(', ' ', /\d/, /\d/, /\d/, ' ', ')', ' ', '-', ' ', /\d/, /\d/, /\d/, /\d/, ' ', '-', ' ', /\d/, /\d/, /\d/, /\d/]}
      placeholderChar={'\u2000'}
      showMask
      style={{
        fontSize: 17,
        width: '100%',
      }}
    />
  );
};

const domains = [
  { value: 'naver.com' },
  { value: 'daum.net' },
  { value: 'nate.com' },
  { value: 'gmail.com' },
  { value: 'hotmail.com' },
  { value: 'yahoo.co.kr' },
];

const UserDataForm = (props) => {
  const { classes } = props;
  const [userData, setUserData] = useState({});
  const [TextType, setTextType] = useState(true);
  const [domain, setDomain] = useState('');
  const [phone, setPhone] = useState('');
  const [snackOpen, setSnackOpen] = useState(false);
  const [state, dispatch] = React.useReducer(myReducer, initialValue);

  const getData = useCallback(async () => {
    axios.post(`${HOST}/api/dashboard/marketer/profile`)
      .then((res) => {
        if (res.data) {
          setUserData(res.data);
          setDomain(res.data.marketerMail.split('@')[1]);
        }
      });
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleChangeType = () => {
    document.getElementById('name').value = '';
    document.getElementById('mail').value = '';
    setTextType(false);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleChange = (event) => {
    setDomain(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (phone === '') {
      alert('휴대전화번호를 입력하세요');
      return;
    }
    const name = document.getElementById('name2').value;
    const mail = document.getElementById('mail2').value;
    const user = {
      marketerName: name,
      marketerMail: `${mail}@${domain}`,
      marketerPhoneNum: phone,
    };
    axios.post(`${HOST}/api/dashboard/marketer/profile/change`, user)
      .then((res) => {
        if (res.data) {
          getData();
          setSnackOpen(true);
          setTextType(true);
        } else {
          alert('변경도중 오류가 발생하였습니다.');
          getData();
          setTextType(true);
        }
      });

    if (!(state.password || state.repasswd)) {
      axios.post(`${HOST}/api/login/changePw`, { password: state.value })
        .then((res) => {
          if (res.data) {
            setSnackOpen(true);
          }
        });
    }
    document.getElementById('password').value = null;
    document.getElementById('repassword').value = null;
  };

  const snackClose = () => {
    setSnackOpen(false);
  };


  const checkPasswd = (event) => {
    event.preventDefault();
    dispatch({ type: 'password', value: event.target.value });
  };

  const checkRePasswd = (event) => {
    event.preventDefault();
    dispatch({ type: 'repasswd', value: event.target.value });
  };

  return (
    <Card>
      <CardHeader color="blueGray">
        <h4 className={classes.cardTitleWhite}>
          {userData.marketerName}
          {' '}
          님의 정보
        </h4>
        <p className={classes.cardCategoryWhite}>정보를 변경하시려면 정보변경을 클릭하세요.</p>
      </CardHeader>
      {TextType ? (
        <div>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={12} md={5}>
                <TextField
                  label="ID"
                  value={userData.marketerId || ''}
                  className={classes.textField}
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={7} />
              <GridItem xs={12} sm={12} md={5}>
                <TextField
                  required
                  label="PASSWORD"
                  type="password"
                  id="password"
                  value="***********"
                  error={state.password}
                  className={classes.textField}
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={7} />

              <GridItem xs={12} sm={12} md={5}>
                <TextField
                  label="NAME"
                  value={userData.marketerName || ''}
                  className={classes.textField}
                  id="name"
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={7} />
              <GridItem xs={12} sm={12} md={7}>
                <TextField
                  label="EMAIL"
                  value={userData.marketerMail || ''}
                  className={classes.textField}
                  id="mail"
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <TextField
                  label="PHONE"
                  value={userData.marketerPhoneNum || ''}
                  className={classes.textField}
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={5} />
              <GridItem xs={12} sm={12} md={2}>
                <TextField
                  label="TYPE"
                  value={!userData.marketerUserType ? '개인' : '법인'}
                  className={classes.textField}
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={10}>
                {userData.marketerUserType
                  ? (
                    <TextField
                      label="REGIDENT NUMBER"
                      className={classes.textField}
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )
                  : <div />
          }
              </GridItem>
            </GridContainer>
          </CardBody>
          <CardFooter>
            <Button onClick={handleChangeType} color="info">
          정보변경
            </Button>
          </CardFooter>
        </div>
      )
        : (
          <form onSubmit={handleSubmit}>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={5}>
                  <TextField
                    label="ID"
                    value={userData.marketerId}
                    className={classes.textField}
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={7} />
                <GridItem xs={12} sm={12} md={5}>
                  <TextField
                    required
                    label="PASSWORD"
                    type="password"
                    id="password"
                    placeholder="비밀번호를 입력하세요."
                    onChange={checkPasswd}
                    helperText={state.password ? '특수문자를 포함한 영문/숫자 혼합 8자리 이상입니다.' : ' '}
                    error={state.password}
                    className={classes.textField}
                    margin="normal"
                    autoFocus
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={5}>
                  <TextField
                    required
                    type="password"
                    label="RE-PASSWORD"
                    placeholder="비밀번호를 재입력하세요."
                    helperText={state.repasswd ? '비밀번호와 동일하지 않습니다.' : ' '}
                    error={state.repasswd}
                    onChange={checkRePasswd}
                    className={classes.textField}
                    margin="normal"
                    id="repassword"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={5}>
                  <TextField
                    required
                    label="NAME"
                    placeholder={userData.marketerName}
                    className={classes.textField}
                    margin="normal"
                    id="name2"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={7} />
                <GridItem xs={12} sm={12} md={5}>
                  <TextField
                    required
                    label="MAIL"
                    placeholder={userData.marketerMail.split('@')[0]}
                    className={classes.textField}
                    margin="normal"
                    id="mail2"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={5}>
                  <TextField
                    required
                    select
                    label="Domain"
                    className={classes.textField}
                    value={domain}
                    onChange={handleChange}
                    margin="normal"
                    SelectProps={{
                      MenuProps: {
                        className: classes.menu,
                      },
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  >
                    {domains.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <TextField
                    required
                    label="PHONE"
                    value={phone}
                    onChange={handlePhoneChange}
                    className={classes.textField}
                    type="tel"
                    margin="normal"
                    InputProps={{
                      inputComponent: TextMaskCustom,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={5} />
                <GridItem xs={12} sm={12} md={2}>
                  <TextField
                    label="TYPE"
                    value={!userData.marketerUserType ? '개인' : '법인'}
                    className={classes.textField}
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={10}>
                  {userData.marketerUserType
                    ? (
                      <TextField
                        label="REGIDENT NUMBER"
          // value={userData.creatorIp}
                        className={classes.textField}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )
                    : <div />
            }
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <div>
                <Button
                  type="submit"
                  value="submit"
                  color="info"
                >
                확인
                </Button>
                <Button
                  // color="info"
                  onClick={() => { setTextType(true); }}
                >
                취소
                </Button>
              </div>
            </CardFooter>
          </form>
        )
          }
      <Snackbar
        place="tr"
        color="success"
        onClose={snackClose}
        message="정보 변경 완료"
        open={snackOpen}
        icon={Check}
        closeNotification={() => { snackClose(); }}
        close
      />
    </Card>

  );
};

export default withStyles(dashboardStyle)(UserDataForm);
