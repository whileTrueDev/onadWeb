// AccountNumber를 입력하는 Form component 작성
import React, { useState, useReducer } from 'react';
import {
  TextField, MenuItem, Grid,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import Button from '../../../../../atoms/CustomButtons/Button';
import banks from './banks';
import accountNumberFormReducer from './AccountNumberForm.reducer';
import usePostRequest from '../../../../../utils/hooks/usePostRequest';

const useStyles = makeStyles((theme: Theme) => ({
  divider: {
    width: 2, height: 28, margin: 4,
  },
  textField: {
    width: '100%', marginBottom: 0,
  },
}));
interface AccountNumberFormProps {
  doProfileDataRequest: () => void;
  handleSnackOpen: () => void;
}
function AccountNumberForm({
  doProfileDataRequest, handleSnackOpen
}: AccountNumberFormProps): JSX.Element {
  const classes = useStyles();

  // 은행
  const [bankState, dispatch] = useReducer(accountNumberFormReducer, { name: '농협', code: '011' });
  const handleChangeBank = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newbank = event.target.value;
    dispatch({ type: 'set', name: newbank });
  };

  // 계좌번호
  const [accountNum, setAccountNum] = useState<string>();
  const handleAccountChange = (values: NumberFormatValues): void => {
    setAccountNum(values.value);
  };

  // 실명
  const [realName, setRealName] = useState('');
  const handleRealNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRealName(event.target.value);
  };

  // 생일
  const [birth, setBirth] = useState<string>();
  const handleBirthChange = (values: NumberFormatValues): void => {
    setBirth(values.value);
  };

  // 출금 계좌 등록을 위한 요청 객체 생성
  const AccountPost = usePostRequest('/creator/account', () => {
    doProfileDataRequest();
    handleSnackOpen();
  });

  const handleSubmit = (event: React.MouseEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const userAccount = {
      bankName: bankState.name,
      bankRealName: realName,
      bankAccount: accountNum,
      birth,
    };

    // usePostRequest
    AccountPost.doPostRequest({ ...userAccount });
  };

  return (
    <form id="accountForm" onSubmit={handleSubmit}>
      <Grid container direction="row" justify="center" spacing={2} style={{ textAlign: 'center' }}>

        <Grid item xs={12} md={9}>
          <TextField
            required
            select
            name="bank"
            id="bank"
            label="은행"
            className={classes.textField}
            value={bankState.name || ''}
            onChange={handleChangeBank}
            style={{ width: '100%' }}
            margin="dense"
          >
            {banks.map((row) => {
              const name = row.bankName;
              return <MenuItem key={name} value={name}>{name}</MenuItem>;
            })}
          </TextField>
        </Grid>
        <Grid item xs={12} md={9}>
          <TextField
            required
            value={realName}
            onChange={handleRealNameChange}
            className={classes.textField}
            margin="dense"
            name="userName"
            label="예금주"
            helperText="해당 계좌의 예금주를 입력해주세요."
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <NumberFormat
            required
            label="주민등록번호 앞자리"
            helperText="앞 6자리만 입력해주세요."
            value={birth}
            onValueChange={handleBirthChange}
            customInput={TextField}
            className={classes.textField}
            margin="dense"
            allowNegative={false}
            allowLeadingZeros
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <NumberFormat
            required
            label="계좌번호"
            helperText="(-)을 제외하고 입력하세요"
            value={accountNum}
            onValueChange={handleAccountChange}
            customInput={TextField}
            margin="dense"
            className={classes.textField}
            allowNegative={false}
            allowLeadingZeros
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <div style={{ textAlign: 'center' }}>
            <Button
              type="submit"
              value="Submit"
              color="primary"
            >
              등록
            </Button>
          </div>
        </Grid>
      </Grid>
    </form>
  );
}


export default AccountNumberForm;
