import React, { useState } from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  DialogActions, DialogContent,
  DialogContentText, TextField,
  FormHelperText, FormControl,
  InputLabel, Input, MenuItem,
} from '@material-ui/core';
import axios from '../../../../utils/axios';
import Dialog from '../../../../atoms/Dialog/Dialog';
import Button from '../../../../atoms/CustomButtons/Button';
import HOST from '../../../../utils/config';
import history from '../../../../history';

const useStyles = makeStyles(theme => ({
  contents: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '400px',
  },
  contentText: {
    marginTop: '8px',
    fontSize: 15,
    fontWeight: '700',
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

function useBankApi() {
  const [bank, setBank] = useState('농협');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('제출');
    const userAccount = {
      bankName: event.target.bank.value,
      idNumber: event.target.idNumber.value,
      bankAccount: event.target.bankAccount.value,
      bankRealName: event.target.accountHolder.value
    };

    /** *******************
     * 계좌 조회 api 요청필요
     ******************* */
    axios.post(`${HOST}/api/regist/accountNum`, userAccount)
      .then((res) => {
        alert('계좌번호 저장에 성공하였습니다.');
        history.push('/dashboard/marketer/myoffice');
      })
      .catch((err) => {
        console.log(err);
        alert('계좌번호 저장에 실패하였습니다.');
      });
  };

  const handleChangeBank = (event) => {
    const newbank = event.target.value;
    setBank(newbank);
  };

  return { bank, handleSubmit, handleChangeBank };
}

const AccountDialog = (props) => {
  const { open, handleDialogClose } = props;
  const classes = useStyles();

  const {
    bank, handleSubmit, handleChangeBank
  } = useBankApi(history);

  const Content = () => (
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
        name="accountHolder"
        InputLabelProps={{
          shrink: true,
        }}
        style={{ width: '200px' }}
      />

      <TextField
        required
        label="주민번호 앞자리"
        name="idNumber"
        id="idNumber"
        className={classes.textField}
        helperText="주민등록번호 앞 6자리를 입력해주세요."
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        style={
            {
              maxWidth: 250,
              marginRight: 10,
            }
          }
      />

      <FormControl className={classes.textField}>
        <InputLabel shrink>계좌번호</InputLabel>
        <Input
          required
          name="bankAccount"
          // endAdornment={(
          //   <InputAdornment position="end">
          //     <Divider className={classes.divider} />
          //     <Button>
          //       조회
          //     </Button>
          //   </InputAdornment>
          // )}
          inputProps={{
            required: '{true}'
          }}
        />
        <FormHelperText>
          {'(-)을 제외한 계좌번호를 입력하세요'}
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
          <Button onClick={handleDialogClose}>
            취소
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

AccountDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,

};

export default AccountDialog;
