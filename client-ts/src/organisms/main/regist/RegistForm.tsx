import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  InputAdornment,
  Button,
  Divider,
  MenuItem,
  TextField,
  Grid,
  Paper,
  Typography,
  Radio,
  FormControlLabel
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Done from '@material-ui/icons/Done';
import useStyles from './style/RegistForm.style';
import axios from '../../../utils/axios';
import SuccessTypo from '../../../atoms/Typography/Success';
import HOST from '../../../config';
import StyledInput from '../../../atoms/StyledInput';
import { Props } from './PlatformRegistForm';

// Style Overriding용.

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

function RegistForm({
  handleBack,
  handleUserSubmit,
  state,
  dispatch,
  loading,
  setLoading,
}: Props): JSX.Element {
  const classes = useStyles();
  const [marketerCustomDomain, setCustomDomain] = useState('');
  const [numberType, setNumberType] = useState(true);

  const handleTypeChange = () => {
    setNumberType(!numberType);
  };
  // handle을 전달.
  function handleCustom(event: React.ChangeEvent<HTMLInputElement>): void {
    setCustomDomain(event.target.value);
  }

  const handleChange = (name: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: name, value: event.target.value });
  };

  function handleChangePhone(value: any): void {
    dispatch({ type: 'phoneNum', value: value.formattedValue });
    // setFomattedPhone(value.formattedValue);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (state.checkDuplication) {
      alert('ID 중복 조회를 해야합니다.');
      return;
    }
    const {
      id, password, repasswd, checkDuplication,
    } = state;

    // const marketerMailId = document.getElementById('email').value;
    const marketerMailId = state.email;

    if (marketerMailId === '') {
      alert('입력이 올바르지 않습니다.');
      return;
    }
    // 모든 state가 false가 되어야한다.
    if (!(id || password || repasswd || checkDuplication)) {
      // const marketerId = document.getElementById('id')!.value;
      const marketerId = state.idValue;
      const marketerName = state.name;
      // const marketerName = document.getElementById('name')!.value;
      const marketerPhoneNum = state.phoneNum;
      const marketerRawPasswd = state.passwordValue;
      const marketerDomain = state.domain === '직접입력' ? marketerCustomDomain : state.domain;
      const user = {
        marketerId,
        marketerRawPasswd,
        marketerName,
        marketerMail: `${marketerMailId}@${marketerDomain}`,
        marketerPhoneNum,
      };
      setLoading(1);
      handleUserSubmit(user);
    } else {
      alert('입력이 올바르지 않습니다.');
    }
  }

  // const checkBusinessRegNum = () => {
  //   alert('준비 중입니다. 회원가입을 진행해 주세요.');
  // };


  function checkDuplicateID(): void {
    // const id = document.getElementById('id')!.value;
    const { idValue } = state;
    if (state.id || idValue === '') {
      alert('ID을 올바르게 입력해주세요.');
    } else {
      axios.post(`${HOST}/marketer/checkId`, { idValue })
        .then((res) => {
          if (res.data) {
            alert('ID가 중복되었습니다. 다른 ID를 사용해주세요.');
            dispatch({ type: 'checkDuplication', value: true });
          } else {
            dispatch({ type: 'checkDuplication', value: false });
          }
        });
    }
  }

  return (
    <div>
      {loading
        ? (
          <Paper elevation={1}>
            <Typography variant="h6" component="h6" style={{ textAlign: 'center' }}>
              회원 등록 중입니다. 잠시만 기다려주세요.
            </Typography>
            <div style={{ textAlign: 'center' }}><CircularProgress /></div>
          </Paper>
        )
        : (
          <form autoComplete="off" onSubmit={handleSubmit} id="form">
            <Grid container direction="column" spacing={1}>
              <Grid item xs={12}>
                <FormControl
                  error={Boolean(state.id)}
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
                        <Button onClick={() => checkDuplicateID()}>
                          조회
                        </Button>
                        {!state.checkDuplication && <SuccessTypo><Done /></SuccessTypo>}
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
                    label="회사명(브랜드명)"
                    id="name"
                    onChange={handleChange('name')}
                    className={classes.textField}
                    // defaultValue={defaultName}
                    placeholder="회사명(브랜드명)을 입력하세요"
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    helperText="크리에이터와 시청자들에게 보여질 이름입니다!"
                  />
                </Grid>
                <Grid item>
                  <Grid container direction="row">
                    <Grid item>
                      <FormControl
                        className={classes.phoneField}
                        required
                        margin="normal"
                      >
                        <InputLabel shrink htmlFor="phoneNumber">전화번호</InputLabel>
                        <NumberFormat
                          placeholder="( ___ ) - ____ - ____"
                          value={state.phoneNum}
                          onValueChange={handleChangePhone}
                          customInput={StyledInput}
                          format={numberType ? '( ### ) - #### - ####' : '( ### ) - ### - ####'}
                          className={classes.phoneField}
                          allowNegative={false}
                        />
                        <FormHelperText>온애드와 연락할 전화번호를 입력하세요.</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item className={classes.switchbox}>
                      <Grid container direction="row">
                        <Grid item>
                          <FormControlLabel
                            value="phone"
                            control={(
                              <Radio
                                checked={numberType}
                                onChange={handleTypeChange}
                                inputProps={{ 'aria-label': 'A' }}
                                size="small"
                                color="primary"
                              />
                            )}
                            className={classes.switch}
                            label="휴대폰"
                            labelPlacement="bottom"
                          />
                        </Grid>
                        <Grid item>
                          <FormControlLabel
                            value="tel"
                            control={(
                              <Radio
                                checked={!numberType}
                                onChange={handleTypeChange}
                                inputProps={{ 'aria-label': 'A' }}
                                size="small"
                                color="primary"
                              />
                            )}
                            className={classes.switch}
                            label="회사"
                            labelPlacement="bottom"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid container direction="row">
                <Grid item>
                  <TextField
                    required
                    label="EMAIL ID"
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
                      {domains.map((option) => (
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
        )}
    </div>
  );
}

export default RegistForm;
