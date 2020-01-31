import React from 'react';
import PropTypes from 'prop-types';
// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
import { TextField } from '@material-ui/core';
import MaskedInput from 'react-text-mask';
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import Card from '../../../../atoms/Card/Card';
import CardHeader from '../../../../atoms/Card/CardHeader';
import CardBody from '../../../../atoms/Card/CardBody';
import CardFooter from '../../../../atoms/Card/CardFooter';
import Button from '../../../../atoms/CustomButtons/Button';
import dashboardStyle from '../../../../assets/jss/onad/views/dashboardStyle';
import UserDataUpdateDialog from './UserDataUpdateDialog';
import useDialog from '../../../../utils/lib/hooks/useDialog';


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
// const domains = [
//   { value: 'naver.com' },
//   { value: 'daum.net' },
//   { value: 'nate.com' },
//   { value: 'gmail.com' },
//   { value: 'hotmail.com' },
//   { value: 'yahoo.co.kr' },
// ];

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

// const initialValue = {
//   value: '',
//   password: false,
//   repasswd: false,
// };
// // reducer를 사용하여 Error를 handling하자
// const myReducer = (state, action) => {
//   switch (action.type) {
//     case 'password': {
//       const regx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
//       if (regx.test(action.value)) {
//         return { ...state, value: action.value, password: false };
//       }
//       return { ...state, value: action.value, password: true };
//     }
//     case 'repasswd': {
//       if (state.value === action.value) {
//         return { ...state, repasswd: false };
//       }
//       return { ...state, repasswd: true };
//     }
//     default: {
//       return state;
//     }
//   }
// };

const UserDataForm = (props) => {
  const { classes, userData, reCall } = props;

  const userDataUpdateDialog = useDialog();
  
  // const editType = useToggle(); // 변경 / 기본 토글
  // const [domain, setDomain] = useState(''); // 이메일 도메인
  // const [phone, setPhone] = useState(''); // 폰번호
  // const [state, dispatch] = React.useReducer(myReducer, initialValue); // 비밀번호 변경 리듀서

  // const handleChangeType = () => {
  //   document.getElementById('name').value = '';
  //   document.getElementById('mail').value = '';
  //   editType.handleToggle();
  // };

  // const handlePhoneChange = (event) => {
  //   setPhone(event.target.value);
  // };

  // const handleDomainChange = (event) => {
  //   setDomain(event.target.value);
  // };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   if (phone === '') {
  //     alert('휴대전화번호를 입력하세요');
  //     return;
  //   }
  //   const name = document.getElementById('name2').value;
  //   const mail = document.getElementById('mail2').value;
  //   const user = {
  //     marketerName: name,
  //     marketerMail: `${mail}@${domain}`,
  //     marketerPhoneNum: phone,
  //   };
  //   axios.post(`${HOST}/api/dashboard/marketer/profile/change`, user)
  //     .then((res) => {
  //       if (res.data) {
  //         reCall();
  //         snack.handleOpen(true);
  //         editType.handleToggle();
  //       } else {
  //         alert('변경도중 오류가 발생하였습니다.');
  //         editType.handleToggle();
  //       }
  //     });

  //   if (!(state.password || state.repasswd)) {
  //     axios.post(`${HOST}/api/login/changePw`, { password: state.value })
  //       .then((res) => {
  //         if (res.data) {
  //           snack.handleOpen(true);
  //         }
  //       });
  //   }
  //   document.getElementById('password').value = null;
  //   document.getElementById('repassword').value = null;
  // };

  // const checkPasswd = (event) => {
  //   event.preventDefault();
  //   dispatch({ type: 'password', value: event.target.value });
  // };

  // const checkRePasswd = (event) => {
  //   event.preventDefault();
  //   dispatch({ type: 'repasswd', value: event.target.value });
  // };

  // useEffect(() => {
  //   setDomain(userData.marketerMail.split('@')[1]);
  //   setPhone(userData.marketerPhoneNum);
  // }, [userData.marketerMail, userData.marketerPhoneNum]);

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
              // error={state.password}
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
              value={!userData.marketerUserType ? '일반인' : '사업자'}
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
                label="COMPANY REGISTRATION NUMBER"
                className={classes.textField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={userData.marketerBusinessRegNum}
              />
            )
            : <div />
          }
          </GridItem>
        </GridContainer>
      </CardBody>
      <CardFooter>
        <Button onClick={()=>{
          userDataUpdateDialog.handleOpen()
        }} color="info">
        정보변경
        </Button>
      </CardFooter>
      <UserDataUpdateDialog
        open={userDataUpdateDialog.open}
        userData={userData}
        handleClose={() => {
          userDataUpdateDialog.handleClose();
        }}
      />
    </Card>
  );
};

UserDataForm.propTypes = {
  userData: PropTypes.object.isRequired,
  reCall: PropTypes.func.isRequired
};

export default withStyles(dashboardStyle)(UserDataForm);
