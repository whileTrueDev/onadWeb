import React, { useState, useEffect } from 'react';
import NumberFormat from 'react-number-format';
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  InputAdornment,
  Button,
  MenuItem,
  TextField,
  Grid,
  Paper,
  Typography,
  FormControlLabel,
  Radio
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import useStyles from './style/PlatformRegistForm.style';
import useGetRequest from '../../../utils/hooks/useGetRequest';
import StyledInput from '../../../atoms/StyledInput';
import { StepAction, StepState } from './Stepper.reducer';


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
export interface Props {
  handleBack: () => void;
  handleUserSubmit: (user: any) => void;
  state: StepState;
  dispatch: (state: StepAction) => void;
  loading: number;
  setLoading: (number: number) => void;
}

interface ProfileData {
  marketerPlatformData: string;
  marketerMail: string;
}

function PlatformRegistForm({
  handleBack,
  handleUserSubmit,
  state,
  dispatch,
  loading,
  setLoading
}: Props): JSX.Element {
  const classes = useStyles();
  const [numberType, setNumberType] = useState(true);
  const [marketerCustomDomain, setCustomDomain] = useState('');
  const [marketerId, setMarketerId] = useState('');

  // user 데이터를 전달 받는 hook 사용하여 기본 값을 가져온다.
  const profileData = useGetRequest<null, ProfileData>('/marketer/social');
  useEffect(() => {
    if (!profileData.loading && profileData.data) {
      const { marketerPlatformData, marketerMail } = profileData.data;

      dispatch({ type: 'domain', value: marketerMail.split('@')[1] });
      dispatch({ type: 'email', value: marketerMail.split('@')[0] });
      setMarketerId(marketerPlatformData);
      dispatch({ type: 'checkDuplication', value: false });
    }
  }, [dispatch, profileData.loading, profileData.data]);

  function handleCustom(event: React.ChangeEvent<HTMLInputElement>): void {
    setCustomDomain(event.target.value);
  }

  function handleTypeToogle(): void {
    setNumberType(!numberType);
  }

  const handleChange = (name: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: name, value: event.target.value });
  };

  function handleChangePhone(value: any): void {
    dispatch({ type: 'phoneNum', value: value.formattedValue });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const { email } = state;
    // 모든 state가 false가 되어야한다.
    // const marketerName = document.getElementById('name').value;
    const marketerName = state.name;
    const marketerBusinessRegNum = (document.getElementById('marketerBusinessRegNum') ? state.marketerBusinessRegNum : '');
    const marketerPhoneNum = state.phoneNum;
    const marketerDomain = state.domain === '직접입력' ? marketerCustomDomain : state.domain;
    const user = {
      marketerId,
      marketerName,
      marketerMail: `${email}@${marketerDomain}`,
      marketerPhoneNum,
      marketerBusinessRegNum,
    };
    setLoading(1);
    handleUserSubmit(user);
  }

  // const checkBusinessRegNum = () => {
  //   alert('준비 중입니다. 회원가입을 진행해 주세요.');
  // };


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
              <Grid item container direction="row">
                <Grid item>
                  <TextField
                    required
                    label="회사명(브랜드명)"
                    id="name"
                    onChange={handleChange('name')}
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
                                onChange={handleTypeToogle}
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
                                onChange={handleTypeToogle}
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
              <Grid item>
                <FormControl style={{ marginTop: '8px', marginBottom: '16px' }}>
                  <InputLabel shrink>사업자등록번호</InputLabel>
                  <Input
                    onChange={handleChange('marketerBusinessRegNum')}
                    name="businessRegNum"
                  />
                  <FormHelperText>사업자 번호를 입력하세요.</FormHelperText>
                </FormControl>
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


export default PlatformRegistForm;
