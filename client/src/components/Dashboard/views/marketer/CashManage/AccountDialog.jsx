import React, { useState } from 'react';
import {
  DialogActions, DialogContent,
  DialogContentText, TextField,
  withStyles, FormHelperText, FormControl,
  InputLabel, Input, MenuItem,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import axios from '../../../../../utils/axios';
import Dialog from '../../../components/Dialog/Dialog';
import Button from '../../../components/CustomButtons/Button';
import HOST from '../../../../../config';

const style = theme => ({
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
});

const banks = [
  {
    bankName: '국민',
    bankCount: 14,
  },
  {
    bankName: '기업',
    bankCount: 14,
  },
  {
    bankName: '농협',
    bankCount: 13,
  },
  {
    bankName: '신한(구)',
    bankCount: 11,
  },
  {
    bankName: '신한(신)',
    bankCount: 12,
  },
  {
    bankName: '우리',
    bankCount: 13,
  },
  {
    bankName: '우체국',
    bankCount: 14,
  },
  {
    bankName: '하나',
    bankCount: 14,
  },
  {
    bankName: '부산',
    bankCount: 13,
  },
  {
    bankName: 'SC제일',
    bankCount: 11,
  },
];

const AccountDialog = (props) => {
  const {
    classes, open, handleDialogClose, history,
  } = props;

  const [bank, setBank] = useState('농협');

  const [bankPattern, setbankPattern] = useState(13);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('제출');
    const userAccount = {
      bankName: event.target.bank.value,
      bankAccount: event.target.bankAccount.value,
    };
    axios.post(`${HOST}/api/regist/accountNum`, userAccount)
      .then((res) => {
        alert('계좌번호 저장에 성공하였습니다.');
        history.push('/dashboard/marketer/cash');
      })
      .catch((err) => {
        console.log(err);
        alert('계좌번호 저장에 실패하였습니다.');
      });
  };

  const handleChangeBack = (event) => {
    const newbank = event.target.value;
    const newbankCount = banks.find(_bank => _bank.bankName === newbank).bankCount;
    setBank(newbank);
    setbankPattern(newbankCount);
  };

  const handleClose = () => {
    handleDialogClose(false);
  };

  const Content = () => (
    <DialogContent className={classes.contents}>
      <DialogContentText className={classes.contentText}>
          환급 받을 계좌를 입력해주세요.
      </DialogContentText>
      <TextField
        required
        select
        label="BANK"
        name="bank"
        className={classes.textField}
        value={bank}
        onChange={handleChangeBack}
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
          name="bankAccount"
          required
          // endAdornment={(
          //   <InputAdornment position="end">
          //     <Divider className={classes.divider} />
          //     <Button>
          //       조회
          //     </Button>
          //   </InputAdornment>
          // )}
          inputProps={{
            required: '{true}',
            pattern: `[0-9]{${bankPattern}}`,
          }}
        />
        <FormHelperText>
          (-)을 제외한
          {' '}
          {bankPattern}
          자리 계좌번호를 입력하세요
        </FormHelperText>
      </FormControl>
    </DialogContent>
  );

  return (
    <Dialog
      maxWidth="xl"
      title="환급 계좌 입력"
      open={open}
      onClose={handleClose}
    >
      {/* <DialogTitle>환급 계좌 입력</DialogTitle> */}
      <form id="accountForm" onSubmit={handleSubmit}>
        <Content />
        <DialogActions>
          <Button type="submit" value="Submit" color="info">
            확인
          </Button>
          <Button onClick={handleClose}>
            취소
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

AccountDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
};

export default withStyles(style)(AccountDialog);
