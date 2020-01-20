import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  InputAdornment,
  Button,
  withStyles,
  MenuItem,
  TextField,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import useFetchData from '../../../utils/lib/hooks/useFetchData';

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
  adornment: {
    fontSize: '20px',
    fontWeight: 900
  }
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
  PlatformRegistForm 수정사항
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

const PlatformRegistForm = (props) => {
  const {
    classes, userType, handleBack, handleUserSubmit, state, dispatch, loading, setLoading
  } = props;

  const [marketerCustomDomain, setCustomDomain] = useState('');
  const [marketerId, setMarketerId] = useState('');
  // user 데이터를 전달 받는 hook 사용하여 기본 값을 가져온다.
  const profileData = useFetchData('/api/dashboard/marketer/profile/google');

  // useEffect로 profileData가 받아지는지 확인

  useEffect(() => {
    if (!profileData.loading) {
      const { marketerPlatformData, marketerMail } = profileData.payload;

      dispatch({ type: 'domain', value: marketerMail.split('@')[1] });
      dispatch({ type: 'email', value: marketerMail.split('@')[0] });
      setMarketerId(marketerPlatformData);
      dispatch({ type: 'checkDuplication', value: false });
    }
  }, [dispatch, profileData.loading, profileData.payload]);
  // handle을 전달.
  const handleCustom = (event) => {
    setCustomDomain(event.target.value);
  };

  const handleChange = name => (event) => {
    dispatch({ type: name, value: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const { email } = state;
    // 모든 state가 false가 되어야한다.
    const marketerName = document.getElementById('name').value;
    const marketerBusinessRegNum = (document.getElementById('marketerBusinessRegNum') ? document.getElementById('marketerBusinessRegNum').value : '');
    const marketerPhoneNum = state.phoneNum;
    const marketerDomain = state.domain === '직접입력' ? marketerCustomDomain : state.domain;
    const marketerUserType = userType;
    const user = {
      marketerId,
      marketerName,
      marketerMail: `${email}@${marketerDomain}`,
      marketerPhoneNum,
      marketerBusinessRegNum,
      marketerUserType
    };
    setLoading(1);
    handleUserSubmit(user);
  };

  // const checkBusinessRegNum = () => {
  //   alert('준비 중입니다. 회원가입을 진행해 주세요.');
  // };


  return (
    <div>
      {loading
        ? (
          <Paper className={classes.root} elevation={1}>
            <Typography variant="h6" component="h6" style={{ textAlign: 'center' }}>
          회원 등록 중입니다. 잠시만 기다려주세요.
            </Typography>
            <div style={{ textAlign: 'center' }}><CircularProgress /></div>
          </Paper>
        )
        : (
          <form autoComplete="off" onSubmit={handleSubmit} id="form">
            <Grid container direction="column" spacing={1}>
              <Grid item container direction="row">
                <Grid item>
                  <TextField
                    required
                    label="회사명(브랜드명)"
                    id="name"
                    className={classes.textField}
                    placeholder="회사명(브랜드명)을 입력하세요"
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    helperText="크리에이터와 시청자들에게 보여질 이름입니다!"
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
                      />
                      <FormHelperText>사업자 번호를 입력하세요.</FormHelperText>
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
                    value={state.email}
                    className={classes.textField}
                    onChange={handleChange('email')}
                    helperText="EMAIL ID을 입력하세요."
                    margin="normal"
                    id="email"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end" className={classes.adornment}><div>@</div></InputAdornment>,
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
        )
    }
    </div>
  );
};

PlatformRegistForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlatformRegistForm);
