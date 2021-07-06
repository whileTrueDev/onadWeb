import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as React from 'react';
import { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import StaticInput from '../../../atoms/StaticInput';
import { useMarketerProfileSocial } from '../../../utils/hooks/query/useMarketerProfileSocial';
import areaCodes, { MenuProps } from '../../../utils/inputs/area-codes';
import { StepAction, StepState } from './Stepper.reducer';
import useStyles from './style/PlatformRegistForm.style';

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

export interface Props {
  handleBack: () => void;
  handleUserSubmit: (user: any) => void;
  state: StepState;
  dispatch: (state: StepAction) => void;
  loading: number;
  setLoading: (number: number) => void;
}

function PlatformRegistForm({
  handleBack,
  handleUserSubmit,
  state,
  dispatch,
  loading,
  setLoading,
}: Props): JSX.Element {
  const classes = useStyles();
  const [numberType, setNumberType] = useState(true);
  const [marketerCustomDomain, setCustomDomain] = useState('');
  const [areaCode, setAreaCode] = useState('');
  const [marketerId, setMarketerId] = useState('');

  // user 데이터를 전달 받는 hook 사용하여 기본 값을 가져온다.
  const profile = useMarketerProfileSocial();
  useEffect(() => {
    if (!profile.isLoading && profile.data) {
      const { marketerPlatformData, marketerMail } = profile.data;

      dispatch({ type: 'domain', value: marketerMail.split('@')[1] });
      dispatch({ type: 'email', value: marketerMail.split('@')[0] });
      setMarketerId(marketerPlatformData);
      dispatch({ type: 'checkDuplication', value: false });
    }
  }, [dispatch, profile.isLoading, profile.data]);

  function handleCustom(event: React.ChangeEvent<HTMLInputElement>): void {
    setCustomDomain(event.target.value);
  }

  function handleAreaCode(event: React.ChangeEvent<{ value: unknown }>): void {
    setAreaCode(event.target.value as string);
  }

  function handleTypeToogle(): void {
    dispatch({ type: 'phoneNum', value: '' });
    setNumberType(!numberType);
  }

  const handleChange = (name: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: name, value: event.target.value });
  };

  function handleChangePhone(value: any): void {
    if (numberType) {
      dispatch({ type: 'phoneNum', value: value.formattedValue });
    } else {
      dispatch({ type: 'companyNum', value: value.formattedValue });
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const { email } = state;
    // 모든 state가 false가 되어야한다.
    // const marketerName = document.getElementById('name').value;
    const marketerName = state.name;
    let marketerPhoneNum = state.phoneNum;
    if (!numberType) {
      if (state.phoneNum.length === 7) {
        marketerPhoneNum = `( ${areaCode} ) - ${state.phoneNum.slice(
          0,
          3,
        )} - ${state.phoneNum.slice(3)}`;
      } else {
        marketerPhoneNum = `( ${areaCode} ) - ${state.phoneNum.slice(
          0,
          4,
        )} - ${state.phoneNum.slice(4)}`;
      }
    }
    const marketerDomain = state.domain === '직접입력' ? marketerCustomDomain : state.domain;
    const user = {
      marketerId,
      marketerName,
      marketerMail: `${email}@${marketerDomain}`,
      marketerPhoneNum,
    };
    setLoading(1);
    handleUserSubmit(user);
  }

  // const checkBusinessRegNum = () => {
  //   alert('준비 중입니다. 회원가입을 진행해 주세요.');
  // };

  return (
    <div>
      {loading ? (
        <Paper elevation={1}>
          <Typography variant="h6" component="h6" style={{ textAlign: 'center' }}>
            회원 등록 중입니다. 잠시만 기다려주세요.
          </Typography>
          <div style={{ textAlign: 'center' }}>
            <CircularProgress />
          </div>
        </Paper>
      ) : (
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
                  helperText="방송인과 시청자들에게 보여질 이름입니다!"
                />
              </Grid>
              <Grid item>
                <FormControl
                  required
                  margin="normal"
                  error={Boolean(state.phoneNumValidationCheck)}
                >
                  <InputLabel shrink htmlFor="phoneNumber">
                    전화번호
                  </InputLabel>
                  {numberType ? (
                    <NumberFormat
                      pattern="^\( [0-9]{3} \) [-] +[0-9]{3,4} [-] +[0-9]{4}$"
                      placeholder="( ___ ) - ____ - ____"
                      value={state.phoneNum}
                      onValueChange={handleChangePhone}
                      customInput={StaticInput}
                      format="( ### ) - #### - ####"
                      className={classes.phoneField}
                      allowNegative={false}
                    />
                  ) : (
                    <Grid container direction="row" className={classes.companyNum}>
                      <Grid item xs={3}>
                        <Select
                          required
                          className={classes.companySelect}
                          value={areaCode}
                          onChange={handleAreaCode}
                          MenuProps={MenuProps}
                        >
                          {areaCodes.map((option: { value: string }) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.value}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid item xs={9}>
                        <NumberFormat
                          value={state.phoneNum}
                          onValueChange={handleChangePhone}
                          customInput={StaticInput}
                          className={classes.companyField}
                          allowNegative={false}
                        />
                      </Grid>
                    </Grid>
                  )}
                  <FormHelperText>
                    {state.phoneNumValidationCheck
                      ? '전화번호를 올바르게 입력하세요!'
                      : '온애드와 연락할 전화번호를 입력하세요.'}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item className={classes.switchbox}>
                <Grid container direction="row">
                  <Grid item>
                    <FormControlLabel
                      value="phone"
                      control={
                        <Radio
                          checked={numberType}
                          onChange={handleTypeToogle}
                          inputProps={{ 'aria-label': 'A' }}
                          size="small"
                          color="primary"
                        />
                      }
                      className={classes.switch}
                      classes={{ label: classes.switchLabel }}
                      label={'휴대폰\0인터넷전화'}
                      labelPlacement="bottom"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      value="tel"
                      control={
                        <Radio
                          checked={!numberType}
                          onChange={handleTypeToogle}
                          inputProps={{ 'aria-label': 'A' }}
                          size="small"
                          color="primary"
                        />
                      }
                      className={classes.switch}
                      classes={{ label: classes.switchLabel }}
                      label="회사"
                      labelPlacement="bottom"
                    />
                  </Grid>
                </Grid>
              </Grid>
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
                    endAdornment: (
                      <InputAdornment position="end" className={classes.adornment}>
                        <div>@</div>
                      </InputAdornment>
                    ),
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
                ) : (
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
                <Button onClick={handleBack} className={classes.button}>
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
