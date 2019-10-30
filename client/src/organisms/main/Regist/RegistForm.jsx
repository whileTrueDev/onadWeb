import React, { useState } from 'react';
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
  Grid,
} from '@material-ui/core';
import Done from '@material-ui/icons/Done';
import axios from '../../../utils/axios';
import SuccessTypo from '../../../atoms/Typography/Success';
import HOST from '../../../utils/config';

// Style Overriding용.
const styles = theme => ({
  textField: {
    [theme.breakpoints.down('xs')]: {
      minWidth: '200px',
      marginRight: 0,
    },
    [theme.breakpoints.up('sm')]: {
      minWidth: '300px',
      marginRight: '10px',
    },
  },
  phoneField: {
    [theme.breakpoints.down('xs')]: {
      minWidth: '200px',
      marginRight: 0,
    },
    [theme.breakpoints.up('sm')]: {
      width: 220,
    },
  },
  divider: {
    width: 2,
    height: 28,
    margin: 2,
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
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
  { value: '직접입력' },
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

  const [marketerCustomDomain, setCustomDomain] = useState('');

  // handle을 전달.
  const handleCustom = (event) => {
    setCustomDomain(event.target.value);
  };

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
      const marketerDomain = state.domain === '직접입력' ? marketerCustomDomain : state.domain;
      const marketerUserType = userType;
      const user = {
        marketerId,
        marketerRawPasswd,
        marketerName,
        marketerMail: `${marketerMailId}@${marketerDomain}`,
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
            dispatch({ type: 'checkDuplication', value: false });
          }
        });
    }
  };

  return (
    <div>
      <form autoComplete="off" onSubmit={handleSubmit} id="form">
        <Grid container direction="column" spacing={1}>
          <Grid item xs={12}>
            <FormControl
              error={state.id}
            >
              <InputLabel shrink>ID</InputLabel>
              <Input
                required
                id="id"
                placeholder="아이디를 입력하세요"
                onChange={handleChange('id')}
                endAdornment={(
                  <InputAdornment position="end">
                    <Divider className={classes.divider} />
                    <Button onClick={checkDuplicateID}>
                        조회
                    </Button>
                    { !state.checkDuplication && <SuccessTypo><Done /></SuccessTypo>}
                  </InputAdornment>
                  )}
              />
              <FormHelperText>{state.id ? '영문자로 시작하는 4-15자 영문 또는 숫자' : ' '}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid container direction="row">
            <Grid item>
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
              />
            </Grid>
            <Grid item>
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
            </Grid>
          </Grid>
          <Grid item container direction="row">
            <Grid item>
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
              />
            </Grid>
            <Grid item>
              <FormControl
                className={classes.phoneField}
                required
                margin="normal"
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
            </Grid>
          </Grid>
          <Grid item>
            {userType
              ? (
                <FormControl style={{ marginTop: '8px', marginBottom: '16px' }}>
                  <InputLabel shrink>사업자등록번호</InputLabel>
                  <Input
                // onChange={handleChange('businessRegNum')}
                    name="businessRegNum"
                    endAdornment={(
                      <InputAdornment position="end">
                        <Divider className={classes.divider} />
                        <Button onClick={checkBusinessRegNum}>
                        조회
                        </Button>
                      </InputAdornment>
                  )}
                  />
                  <FormHelperText>사업자 번호를 입력후 조회버튼을 누르세요.</FormHelperText>
                </FormControl>
              )
              : <div />
          }
          </Grid>
          <Grid container direction="row">
            <Grid item>
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
                inputprops={{
                  endAdornment: <InputAdornment position="end">@</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item>
              {state.domain !== '직접입력' ? (
                <TextField
                  required
                  select
                  label="Domain"
                  className={classes.textField}
                  value={state.domain}
                  onChange={handleChange('domain')}
                  helperText="EMAIL Domain을 선택하세요."
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                >
                  {domains.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>

              )
                : (
                  <TextField
                    required
                    autoFocus
                    label="Domain"
                    className={classes.textField}
                    value={marketerCustomDomain}
                    onChange={handleCustom}
                    helperText="EMAIL Domain을 입력하세요."
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                  />
                )}
            </Grid>
          </Grid>
          <Grid item style={{ marginTop: '16px' }}>
            <div>
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
          </Grid>
        </Grid>
      </form>

    </div>
  );
};

RegistForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegistForm);
