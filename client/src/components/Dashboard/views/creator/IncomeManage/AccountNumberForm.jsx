// AccountNumber를 입력하는 Form component 작성
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  DialogActions,
  TextField,
  withStyles,
  FormHelperText,
  FormControl,
  InputLabel,
  Input,
  MenuItem,
} from '@material-ui/core';
import axios from '../../../../../utils/axios';
import Button from '../../../components/CustomButtons/Button';
import HOST from '../../../../../config';


const style = theme => ({
  contents: {
    display: 'flex',
    flexDirection: 'column',
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
});


const banks = [
  {
    bankName: '국민',
    bankCount: 14,
    bankCode: '004',
  },
  {
    bankName: '기업',
    bankCount: 14,
    bankCode: '004',
  },
  {
    bankName: '농협',
    bankCount: 13,
    bankCode: '011',
  },
  {
    bankName: '신한(구)',
    bankCount: 11,
    bankCode: '088',
  },
  {
    bankName: '신한(신)',
    bankCount: 12,
    bankCode: '088',
  },
  {
    bankName: '우리',
    bankCount: 13,
    bankCode: '020',
  },
  {
    bankName: '하나',
    bankCount: 14,
    bankCode: '081',
  },
  {
    bankName: '부산',
    bankCount: 13,
    bankCode: '032',
  },
  {
    bankName: 'SC제일',
    bankCount: 11,
    bankCode: '023',
  },
];


// const getNowDate = () => {
//   const date = new Date();
//   const fullDate = date.getFullYear() + (`0${date.getMonth() + 1}`).slice(-2)
//     + (`0${date.getDate()}`).slice(-2) + (`0${date.getHours()}`).slice(-2)
//     + (`0${date.getMinutes()}`).slice(-2) + (`0${date.getSeconds()}`).slice(-2);
//   return fullDate;
// };

const AccountNumberForm = (props) => {
  const {
    classes, handleClose, history,
  } = props;
  const [bank, setBank] = useState('농협');
  const [bankPattern, setbankPattern] = useState(13);
  // const [accountConfirm, setAccountConfirm] = useState(false);

  // const accountValidation = (event) => {
  //   event.preventDefault();
  //   // const bankAccount = document.getElementById('bankAccount').value || '';
  //   // const bankName = document.getElementById('bank').value || '';
  //   // const idNumber = document.getElementById('idNumber').value || '';
  //   // const { bankCode } = banks.find(_bank => _bank.bankName === bankName);

  //   // const headers = {
  //   //   Authorization: 'Bearer d3608258-af4a-467a-8e33-d29bfbcd6ec0',
  //   //   'Content-Type': 'application/json',
  //   // };
  //   setAccountConfirm(true);
  //   alert('계좌인증에 성공하였습니다.');
  //   // axios.post('https://testapi.open-platform.or.kr/inquiry/real_name', {
  //   //   bank_code_std: '002', // 테스트는 '002' bankCode
  //   //   account_num: '1234567890123456', // 1234567890123456
  //   //   account_holder_info: '880101', // 880101
  //   //   tran_dtime: getNowDate(),
  //   // }, { headers })
  //   //   .then((res) => {
  //   //     console.log(res.data);
  //   //     if (res.data.rsp_code === 'A0000') {
  //   //       setAccountConfirm(true);
  //   //       alert('계좌인증에 성공하였습니다.');
  //   //     } else {
  //   //       alert('계좌인증에 실패하였습니다.');
  //   //     }
  //   //   });
  // };


  const handleSubmit = (event) => {
    event.preventDefault();
    // if (!accountConfirm) {
    //   alert('계좌 본인인증을 해주세요!');
    //   return;
    // }
    const userAccount = {
      bankName: event.target.bank.value,
      bankAccount: event.target.bankAccount.value,
    };
    axios.post(`${HOST}/api/regist/accountNum`, userAccount)
      .then((res) => {
        const { error } = res.data;
        if (!error) {
          alert('계좌번호 저장에 성공하였습니다.');
          if (handleClose) {
            handleClose();
          }
          history.push(window.location.pathname);
        } else {
          alert('계좌번호 저장에 실패하였습니다.');
        }
      });
  };


  const handleChangeBank = (event) => {
    const newbank = event.target.value;
    const newbankCount = banks.find(_bank => _bank.bankName === newbank).bankCount;
    setBank(newbank);
    setbankPattern(newbankCount);
  };

  return (
    <form id="accountForm" onSubmit={handleSubmit}>
      <div className={classes.contents}>
        <TextField
          required
          select
          label="BANK"
          name="bank"
          id="bank"
          className={classes.textField}
          value={bank || ''}
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
            id="bankAccount"
            required
            // endAdornment={(
            //   <InputAdornment position="end">
            //     <Divider className={classes.divider} />
            //     <OriginalButton onClick={accountValidation}>
            //     조회
            //     </OriginalButton>
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


      </div>


      <DialogActions>
        <Button
          type="submit"
          value="Submit"
          color="info"
          className={
            !handleClose
              ? 'MuiButtonBase-root MuiButton-root RegularButton-button-133 RegularButton-primary-136 MuiButton-text'
              : ''
            }
        >
          등록
        </Button>
        {handleClose
          && (
          <Button onClick={handleClose}>
              취소
          </Button>
          )}
      </DialogActions>
    </form>
  );
};

AccountNumberForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleClose: PropTypes.func,
};

AccountNumberForm.defaultProps = {
  handleClose: () => {},
};


export default withStyles(style)(AccountNumberForm);
