import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  DialogActions, DialogContent,
  DialogContentText, TextField,
  FormHelperText, FormControl,
  InputLabel, Input, MenuItem,
} from '@material-ui/core';
import axios from '../../../../utils/axios';
import Dialog from '../../../../atoms/Dialog/Dialog';
import Button from '../../../../atoms/CustomButtons/Button';
import HOST from '../../../../config';
import history from '../../../../history';

const useStyles = makeStyles((theme: Theme) => ({
  contents: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '400px',
  },
  contentText: {
    marginTop: '8px',
    fontSize: 15,
    fontWeight: 700,
  },
  divider: {
    width: 2,
    height: 28,
    margin: 4,
  },
  textField: {
    margin: theme.spacing(1),
    marginBottom: theme.spacing(2),
    minWidth: 120,
  },
  sectionButton: {
    flex: 1,
    display: 'none',
    justifyContent: 'flex-end',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
}));

const banks = [
  { bankName: '국민', }, { bankName: '기업', },
  { bankName: '농협', }, { bankName: '신한(구)', },
  { bankName: '신한(신)', }, { bankName: '우리', },
  { bankName: '우체국', }, { bankName: '하나', },
  { bankName: '부산', }, { bankName: 'SC제일', },
];

const AccountDialog = (
  props: {
    open: boolean;
    handleDialogClose: () => void;
  }
): JSX.Element => {
  const { open, handleDialogClose } = props;
  const classes = useStyles();

  const [bank, setBank] = useState<string>('농협');

  const handleChangeBank = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newbank = event.target.value;
    setBank(newbank);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log('제출');

    const bankRealName = (document.getElementById('accountHolder') as HTMLInputElement).value;
    const idNumber = (document.getElementById('idNumber') as HTMLInputElement).value;
    const bankAccount = (document.getElementById('bankAccount') as HTMLInputElement).value;

    /** *******************
     * 계좌 조회 api 요청필요
     ******************* */
    axios.put(`${HOST}/marketer/account`, {
      bankName: bank, bankRealName, idNumber, bankAccount
    })
      .then(() => {
        alert('계좌번호 저장에 성공하였습니다.');
        handleDialogClose();
        history.push('/mypage/marketer/myoffice');
      })
      .catch((err) => {
        console.log(err);
        alert('계좌번호 저장에 실패하였습니다.');
      });
  };


  const Content = (): JSX.Element => (
    <DialogContent className={classes.contents}>
      <DialogContentText className={classes.contentText}>
        환불 받을 계좌정보를 입력해주세요.
      </DialogContentText>
      <TextField
        required
        select
        label="BANK"
        name="bank"
        className={classes.textField}
        value={bank}
        onChange={handleChangeBank}
        helperText="은행을 선택하세요."
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"

      >
        {banks.map((row) => {
          const name = row.bankName;
          return <MenuItem key={name} value={name}>{name}</MenuItem>;
        })}
      </TextField>

      <TextField
        required
        label="예금주"
        margin="dense"
        className={classes.textField}
        id="accountHolder"
        type="text"
        inputProps={{
          maxLength: 17
        }}
        InputLabelProps={{
          shrink: true,
        }}
        style={{ width: '200px' }}
      />

      <TextField
        required
        label="주민번호 앞자리"
        id="idNumber"
        className={classes.textField}
        helperText="주민등록번호 앞 6자리를 입력해주세요."
        margin="normal"
        type="number"
        inputProps={{
          maxLength: 6
        }}
        InputLabelProps={{
          shrink: true,
        }}
        style={{
          maxWidth: 250,
          marginRight: 10,
        }}
      />

      <FormControl className={classes.textField}>
        <InputLabel shrink>계좌번호</InputLabel>
        <Input
          required
          id="bankAccount"
          type="number"
          inputProps={{
            required: true,
            maxLength: 16
          }}
        />
        <FormHelperText>
          (-)을 제외한 계좌번호를 입력하세요
        </FormHelperText>
      </FormControl>
    </DialogContent>
  );

  return (
    <Dialog
      maxWidth="xl"
      title="환불 계좌 입력"
      open={open}
      onClose={handleDialogClose}

    >
      {/* <DialogTitle>환급 계좌 입력</DialogTitle> */}
      <form id="accountForm" onSubmit={handleSubmit}>
        <Content />

        <DialogActions>
          <Button type="submit" value="Submit" color="primary">
            확인
          </Button>
          <Button color="default" onClick={handleDialogClose}>
            취소
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AccountDialog;
