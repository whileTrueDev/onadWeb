import React from 'react';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  InputAdornment,
  Button,
  Divider,
  withStyles,
  MenuItem,
  TextField,
} from '@material-ui/core';
import Done from '@material-ui/icons/Done';
import Clear from '@material-ui/icons/Clear';
import axios from '../../utils/axios';
import SuccessTypo from '../Dashboard/components/Typography/Success';
import DangerTypo from '../Dashboard/components/Typography/Danger';
import HOST from '../../config';

// Style Overriding용.
const styles = theme => ({
  container: {
    display: 'block',
    flexWrap: 'wrap',
    width: 700,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: 0,
    marginBottom: theme.spacing(1),
    width: 250,
  },
  menu: {
    width: 200,
  },
  divider: {
    width: 2,
    height: 28,
    margin: 4,
  },
  codeField: {
    marginLeft: theme.spacing(1),
    marginRight: 0,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: 400,
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  row: {
    flex: 1,
    flexDirection: 'row', // 혹은 'column'
  },
});

// domain select용.
const domains = [
  { value: 'naver.com' },
  { value: 'daum.net' },
  { value: 'nate.com' },
  { value: 'gmail.com' },
  { value: 'hotmail.com' },
  { value: 'yahoo.co.kr' },
];


/*
2019-07-04 박찬우
  RegistForm 수정사항
  1. 함수형 Component화
  2. value를 state로 사용하지 않고 event를 통하여 catch
  3. handleChange 로 onChange listener 통일 및 Reducer를 통한 형식 check
  4. ID 중복 조회 완료 후 check icon 생성.

  State 에 value가 존재하는 input값.
  - 1. phoneNum
  - 2. domain
  - 3. passwordValue
*/

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
        width: 200,
      }}
    />
  );
};

const RegistForm = (props) => {
  const {
    classes, userType, handleBack, handleUserInfo, handleNext, state, dispatch,
  } = props;

  // handle을 전달.

  const handleChange = name => (event) => {
    dispatch({ type: name, value: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (state.checkDuplication) {
      alert('ID 중복 조회를 해야합니다.');
      return;
    }
    const {
      id, password, repasswd, checkDuplication, email,
    } = state;
    // 모든 state가 false가 되어야한다.
    if (!(id || password || repasswd || checkDuplication || email)) {
      const marketerId = document.getElementById('id').value;
      const marketerMailId = document.getElementById('email').value;
      const marketerName = document.getElementById('name').value;
      const marketerBusinessRegNum = (document.getElementById('marketerBusinessRegNum') ? document.getElementById('marketerBusinessRegNum').value : '');
      const marketerPhoneNum = state.phoneNum;
      const marketerRawPasswd = state.passwordValue;
      const makreterDomain = state.domain;
      const marketerUserType = userType;
      const user = {
        marketerId,
        marketerRawPasswd,
        marketerName,
        marketerMail: `${marketerMailId}@${makreterDomain}`,
        marketerPhoneNum,
        marketerBusinessRegNum,
        marketerUserType,
      };
      handleUserInfo(user);
      handleNext();
    } else {
      alert('입력이 올바르지 않습니다.');
    }
  };

  const checkBusinessRegNum = () => {
    alert('준비 중입니다. 회원가입을 진행해 주세요.');
  };

  const checkDuplicateID = () => {
    const id = document.getElementById('id').value;
    if (state.id || id === '') {
      alert('ID을 올바르게 입력해주세요.');
    } else {
      axios.post(`${HOST}/api/regist/checkId`, {
        id,
      })
        .then((res) => {
          if (res.data) {
            alert('ID가 중복되었습니다. 다시 입력해 주세요.');
            dispatch({ type: 'checkDuplication', value: true });
          } else {
            alert('회원가입이 가능합니다. 계속 진행하세요.');
            dispatch({ type: 'checkDuplication', value: false });
          }
        });
    }
  };

  return (
    <div className={classes.container}>
      <form autoComplete="off" onSubmit={handleSubmit} id="form">
        <FormControl
          className={classes.codeField}
          error={state.id}
        >
          <InputLabel shrink>ID</InputLabel>
          <Input
            required
            id="id"
            placeholder="아이디를 입력하세요"
            style={{ width: 300 }}
            onChange={handleChange('id')}
            endAdornment={(
              <InputAdornment position="end">
                <Divider className={classes.divider} />
                <Button onClick={checkDuplicateID}>
                    조회
                </Button>
                { !state.checkDuplication
                  ? <SuccessTypo><Done /></SuccessTypo>
                  : (
                    <DangerTypo>
                      <Clear />
                    </DangerTypo>
                  )}
              </InputAdornment>
              )}
          />
          <FormHelperText>{state.id ? '영문자로 시작하는 4-15자 영문 또는 숫자' : ' '}</FormHelperText>
        </FormControl>
        <br />
        <TextField
          required
          label="PASSWORD"
          type="password"
          placeholder="비밀번호를 입력하세요."
          className={classes.textField}
          onChange={handleChange('password')}
          helperText={state.password ? '특수문자를 포함한 8-20자 영문 또는 숫자' : ' '}
          error={state.password}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          style={
            {
              marginRight: 10,
            }
          }
        />
        <TextField
          required
          label="RE-PASSWORD"
          type="password"
          placeholder="비밀번호를 재입력하세요."
          helperText={state.repasswd ? '비밀번호와 동일하지 않습니다.' : ' '}
          error={state.repasswd}
          className={classes.textField}
          onChange={handleChange('repasswd')}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          required
          label="이름(회사명)"
          id="name"
          className={classes.textField}
          placeholder="이름(회사명)을 입력하세요"
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          style={
            {
              width: 300,
              marginRight: 10,
            }
          }
        />

        <FormControl
          className={classes.textField}
          required
          margin="normal"
          style={{ width: 220 }}
        >
          <InputLabel shrink htmlFor="phoneNumber">전화번호</InputLabel>
          <Input
            value={state.phoneNum}
            onChange={handleChange('phoneNum')}
            id="phoneNumber"
            inputComponent={TextMaskCustom}
          />
          <FormHelperText>전화번호를 입력하세요.</FormHelperText>
        </FormControl>
        <br />

        {userType
          ? (
            <FormControl className={classes.codeField}>
              <InputLabel shrink>사업자등록번호</InputLabel>
              <Input
                // onChange={handleChange('businessRegNum')}
                name="businessRegNum"
                placeholder="사업자등록번호를 입력하세요"
                endAdornment={(
                  <InputAdornment position="end">
                    <Divider className={classes.divider} />
                    <Button onClick={checkBusinessRegNum}>
                        조회
                    </Button>
                  </InputAdornment>
                  )}
              />
              <FormHelperText>회사에 등록된 사업자 번호를 입력후 조회버튼을 누르세요.</FormHelperText>
            </FormControl>
          )
          : <div />
          }
        <br />

        <TextField
          required
          label="EMAIL ID"
          className={classes.textField}
          onChange={handleChange('email')}
          helperText={state.email ? 'ID의 형식이 올바르지 않습니다.' : 'EMAIL ID을 입력하세요.'}
          error={state.email}
          margin="normal"
          id="email"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">@</InputAdornment>,
          }}
          style={
            {
              width: 200,
            }
          }
        />

        <TextField
          required
          select
          label="Domain"
          className={classes.textField}
          value={state.domain}
          onChange={handleChange('domain')}
          helperText="EMAIL Domain을 선택하세요."
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          style={
            {
              width: 200,
            }
          }
        >
          {domains.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.value}
            </MenuItem>
          ))}
        </TextField>
        <div className={classes.actionsContainer}>
          <Button
            onClick={handleBack}
            className={classes.button}
          >
        뒤로
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            type="submit"
            value="submit"
          >
            다음
          </Button>
        </div>
      </form>
    </div>
  );
};

RegistForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegistForm);
