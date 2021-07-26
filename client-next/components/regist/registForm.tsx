// material-UI
import {
  FormControl,
  InputLabel,
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
  FormControlLabel,
  Select,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Done from '@material-ui/icons/Done';
// 내부 소스
// 프로젝트 내부 모듈
import * as React from 'react';
import NumberFormat from 'react-number-format';
import {useState} from 'react';
// 컴포넌트
import SuccessTypo from '../../atoms/typography/success';
import StaticInput from '../../atoms/input/staticInput';
import { Props } from './platformRegistForm';
// util 계열
import axios from '../../utils/axios';
import HOST from '../../config';
import domains from '../../utils/inputs/email-domains';
import areaCodes, { MenuProps } from '../../utils/inputs/area-codes';
// 스타일
import useStyles from '../../styles/regist/registForm.style';

export const initialIdState = {
  idCheck: false,
  idValue: '',
  checkDuplication: true,
}

function RegistForm({
  handleBack,
  handleUserSubmit,
  formState,
  dispatch,
  loading,
  setLoading,
}: Props): JSX.Element {
  const classes = useStyles();
  const [marketerCustomDomain, setCustomDomain] = useState('');
  const [areaCode, setAreaCode] = useState('');
  const [numberType, setNumberType] = useState(true);

  const [idState, setIdState] = useState(initialIdState)

  const handleTypeChange = () => {
    // numberType이 변경될 때, 데이터도 리셋.
    dispatch({ type: 'phoneNum', value: '' });
    setNumberType(!numberType);
  };
  // handle을 전달.
  function handleCustom(event: React.ChangeEvent<HTMLInputElement>): void {
    setCustomDomain(event.target.value);
  }

  function handleAreaCode(event: React.ChangeEvent<{ value: unknown }>): void {
    setAreaCode(event.target.value as string);
  }

  const handleChange = (name: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (name !== 'idCheck') {
      dispatch({ type: name, value: event.target.value });
    } else {
      const userIdRegex = /^[a-z]+[a-z0-9]{5,14}$/g;
      const regexTest = userIdRegex.test(event.target.value)
      if (regexTest) {
        setIdState({
          checkDuplication: true,
          idValue: event.target.value,
          idCheck: false,
        })
      } else {
        setIdState({
          checkDuplication: true,
          idValue: event.target.value,
          idCheck: true,
        })
      }
    }
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
    const { password, repasswd, phoneNumValidationCheck } = formState;
    const {idCheck, checkDuplication, idValue} = idState

    if (checkDuplication) {
      alert('ID 중복 조회를 해야합니다.');
      return;
    }

    const marketerMailId = formState.email;

    if (marketerMailId === '') {
      alert('입력이 올바르지 않습니다.');
      return;
    }

    // 모든 formState가 false가 되어야한다.
    if (!(idCheck || password || repasswd || checkDuplication || phoneNumValidationCheck)) {
      const marketerId = idValue;
      const marketerName = formState.name;
      let marketerPhoneNum = formState.phoneNum;
      if (!numberType) {
        if (formState.phoneNum.length === 7) {
          marketerPhoneNum = `( ${areaCode} ) - ${formState.phoneNum.slice(
            0,
            3,
          )} - ${formState.phoneNum.slice(3)}`;
        } else {
          marketerPhoneNum = `( ${areaCode} ) - ${formState.phoneNum.slice(
            0,
            4,
          )} - ${formState.phoneNum.slice(4)}`;
        }
      }
      const marketerRawPasswd = formState.passwordValue;
      const marketerDomain = formState.domain === '직접입력' ? marketerCustomDomain : formState.domain;
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
    const {idCheck, idValue } = idState;
    if (idCheck || idValue === '') {
      alert('ID을 올바르게 입력해주세요.');
      setIdState({...idState, checkDuplication: true})
    } else {
      axios.post(`${HOST}/marketer/checkId`, { idValue }).then(res => {
        if (res.data) {
          alert('ID가 중복되었습니다. 다른 ID를 사용해주세요.');
          setIdState({...idState, checkDuplication: true})
        } else {
          setIdState({...idState, checkDuplication: false})
        }
      });
    }
  }

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
            <Grid item xs={12}>
              <TextField
                type="text"
                label="아이디"
                required
                error={idState.idCheck}
                placeholder="아이디를 입력하세요"
                onChange={handleChange('idCheck')}
                inputProps={{
                  maxLength: 15,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Divider className={classes.divider} />
                      <Button color="primary" onClick={() => checkDuplicateID()}>
                        중복조회
                      </Button>
                      {!idState.checkDuplication && (
                        <SuccessTypo>
                          <Done />
                        </SuccessTypo>
                      )}
                    </InputAdornment>
                  ),
                }}
                helperText={idState.idCheck ? '6자 이상, 15자 이하 영문(소문자) 또는 숫자' : ''}
              />
            </Grid>
            <Grid container direction="row">
              <Grid item>
                <TextField
                  required
                  type="password"
                  label="비밀번호"
                  placeholder="비밀번호를 입력하세요."
                  className={classes.textField}
                  onChange={handleChange('password')}
                  helperText={
                    formState.password ? '특수문자 !@#$%^*+=- 를 포함한 8-20 영문 또는 숫자' : ' '
                  }
                  error={formState.password}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ maxLength: 20 }}
                />
              </Grid>
              <Grid item>
                <TextField
                  required
                  type="password"
                  label="비밀번호확인"
                  placeholder="비밀번호 확인을 입력하세요."
                  helperText={formState.repasswd ? '비밀번호와 동일하지 않습니다.' : ' '}
                  error={formState.repasswd}
                  className={classes.textField}
                  onChange={handleChange('repasswd')}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ maxLength: 20 }}
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
                  placeholder="회사명(브랜드명)을 입력하세요"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    maxLength: 15,
                  }}
                  helperText="방송인과 시청자에게 해당 이름으로 보여집니다."
                />
              </Grid>
              <Grid item>
                <Grid container direction="row">
                  <Grid item>
                    <FormControl
                      className={classes.phoneField}
                      required
                      margin="normal"
                      error={Boolean(formState.phoneNumValidationCheck)}
                    >
                      <InputLabel shrink htmlFor="phoneNumber">
                        전화번호
                      </InputLabel>
                      {numberType ? (
                        <NumberFormat
                          pattern="^\( [0-9]{3} \) [-] +[0-9]{3,4} [-] +[0-9]{4}$"
                          placeholder="( ___ ) - ____ - ____"
                          value={formState.phoneNum}
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
                              value={formState.phoneNum}
                              onValueChange={handleChangePhone}
                              customInput={StaticInput}
                              className={classes.companyField}
                              allowNegative={false}
                            />
                          </Grid>
                        </Grid>
                      )}
                      <FormHelperText>
                        {formState.phoneNumValidationCheck
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
                              onChange={handleTypeChange}
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
                              onChange={handleTypeChange}
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
              </Grid>
            </Grid>

            <Grid container direction="row">
              <Grid item>
                <TextField
                  required
                  label="이메일"
                  className={classes.textField}
                  onChange={handleChange('email')}
                  helperText="연락 가능한 이메일을 입력하세요."
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
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  inputProps={{
                    maxLength: 64,
                  }}
                />
              </Grid>
              <Grid item>
                {formState.domain !== '직접입력' ? (
                  <TextField
                    required
                    select
                    label="도메인"
                    className={classes.textField}
                    value={formState.domain}
                    onChange={handleChange('domain')}
                    helperText="EMAIL 도메인을 선택하세요."
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
                    label="도메인"
                    inputProps={{
                      maxLength: 255,
                    }}
                    className={classes.textField}
                    value={marketerCustomDomain}
                    onChange={handleCustom}
                    helperText="이메일 도메인을 입력하세요."
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

export default RegistForm;
