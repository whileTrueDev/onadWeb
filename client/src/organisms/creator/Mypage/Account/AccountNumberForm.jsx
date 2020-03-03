// AccountNumber를 입력하는 Form component 작성
import React, { useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  withStyles,
  MenuItem,
  Grid,
} from '@material-ui/core';
import NumberFormat from 'react-number-format';
import axios from '../../../../utils/axios';
import Button from '../../../../atoms/CustomButtons/Button';
import HOST from '../../../../utils/config';
import history from '../../../../history';

const style = (theme) => ({
  divider: {
    width: 2,
    height: 28,
    margin: 4,
  },
  textField: {
    width: '100%',
    marginBottom: 0,
  },
  item: {
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: 0,
      padding: 0,
    },
  },
});


const banks = [
  {
    bankName: '국민',
    bankCode: '004',
  },
  {
    bankName: '기업',
    bankCode: '004',
  },
  {
    bankName: '농협',
    bankCode: '011',
  },
  {
    bankName: '신한',
    bankCode: '088',
  },
  {
    bankName: '우리',
    bankCode: '020',
  },
  {
    bankName: 'KEB 하나',
    bankCode: '081',
  },
  {
    bankName: '부산',
    bankCode: '032',
  },
  {
    bankName: 'SC제일',
    bankCode: '023',
  },
  {
    bankName: '산업',
    bankCode: '002',
  },
  {
    bankName: '수협',
    bankCode: '007',
  },
  {
    bankName: '씨티',
    bankCode: '027',
  },
  {
    bankName: '대구',
    bankCode: '031',
  },
  {
    bankName: '광주',
    bankCode: '034',
  },
  {
    bankName: '제주',
    bankCode: '035',
  },
  {
    bankName: '전북',
    bankCode: '037',
  },
  {
    bankName: '경남',
    bankCode: '039',
  },
  {
    bankName: 'K 뱅크',
    bankCode: '089',
  },
  {
    bankName: '카카오뱅크',
    bankCode: '090',
  },
];

const getNowDate = () => {
  const date = new Date();
  const fullDate = date.getFullYear() + (`0${date.getMonth() + 1}`).slice(-2)
    + (`0${date.getDate()}`).slice(-2) + (`0${date.getHours()}`).slice(-2)
    + (`0${date.getMinutes()}`).slice(-2) + (`0${date.getSeconds()}`).slice(-2);
  return fullDate;
};

const bankReducer = (state, action) => {
  switch (action.type) {
    case 'set': {
      return {
        name: action.name,
        code: banks.find((_bank) => _bank.bankName === action.name).bankCode
      };
    }
    default: {
      return { name: '농협', code: '011' };
    }
  }
};

const AccountNumberForm = (props) => {
  const {
    classes, handleClose
  } = props;
  // const [bank, setBank] = useState('농협');
  const [realName, setRealName] = useState('');
  const [bankState, dispatch] = useReducer(bankReducer, { name: '농협', code: '011' });
  const [birth, setBirth] = useState(null);
  const [accountNum, setAccountNum] = useState(null);
  const [setAccountConfirm] = useState(false);

  const handleChangeBank = (event) => {
    const newbank = event.target.value;
    dispatch({ type: 'set', name: newbank });
  };

  const onAccountChange = (value) => {
    setAccountNum(value.value);
  };

  const onRealNameChange = (event) => {
    setRealName(event.target.value);
  };

  const onBirthChange = (value) => {
    setBirth(value.value);
  };

  const accountValidation = (event) => {
    event.preventDefault();
    const headers = {
      Authorization: 'Bearer OVGY8ObRgN6Glqqc9A0T1nAcQ4CXgBaEKKUCGx8c',
      'Content-Type': 'application/json; charset=UTF-8',
    };
    // setAccountConfirm(true);
    // alert('계좌인증에 성공하였습니다.');
    axios.post('https://openapi.open-platform.or.kr/inquiry/real_name', {
      bank_code_std: '098', // 테스트는 '002' bankCode
      account_num: '0001230000678', // 1234567890123456
      account_holder_info: '8801012', // 880101
      tran_dtime: getNowDate(),
    }, { headers })
      .then((res) => {
        if (res.data.rsp_code === 'A0000') {
          setAccountConfirm(true);
          alert('계좌인증에 성공하였습니다.');
        } else {
          alert('계좌인증에 실패하였습니다.');
        }
      });
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    // if (!accountConfirm) {
    //   alert('계좌 본인인증을 해주세요!');
    //   return;
    // }
    const userAccount = {
      bankName: bankState.name,
      bankRealName: realName,
      bankAccount: accountNum,
      birth,

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

  return (
    <form id="accountForm" onSubmit={handleSubmit}>
      <Grid container direction="row" justify="center" spacing={2}>

        <Grid item xs={12} md={9} className={classes.item}>
          <TextField
            required
            select
            name="bank"
            id="bank"
            label="은행"
            className={classes.textField}
            value={bankState.name || ''}
            onChange={handleChangeBank}
            style={{ width: '50%' }}
            margin="dense"
          >
            {banks.map((row) => {
              const name = row.bankName;
              return <MenuItem key={name} value={name}>{name}</MenuItem>;
            })}
          </TextField>
        </Grid>
        <Grid item xs={12} md={9} className={classes.item}>
          <TextField
            required
            value={realName}
            onChange={onRealNameChange}
            className={classes.textField}
            margin="dense"
            name="userName"
            label="예금주"
            helperText="해당 계좌의 예금주를 입력해주세요."
          />
        </Grid>
        <Grid item xs={12} md={9} className={classes.item}>
          <NumberFormat
            required
            label="주민등록번호 앞자리"
            helperText="앞 6자리만 입력해주세요."
            value={birth}
            onValueChange={onBirthChange}
            customInput={TextField}
            className={classes.textField}
            margin="dense"
            allowNegative={false}
            allowLeadingZeros
          />
        </Grid>
        <Grid item xs={12} md={9} className={classes.item}>
          <div style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-around'
          }}
          >
            <NumberFormat
              required
              label="계좌번호"
              helperText="(-)을 제외하고 입력하세요"
              value={accountNum}
              onValueChange={onAccountChange}
              customInput={TextField}
              margin="dense"
              className={classes.textField}
              style={{ width: '60%' }}
              allowNegative={false}
              allowLeadingZeros
            />
            <Button size="medium" color="blueGray" onClick={accountValidation} style={{ width: '30%' }}>조회</Button>
          </div>
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
            {handleClose && (
            <Button onClick={handleClose}>
              취소
            </Button>
            )}
          </div>
        </Grid>
      </Grid>
    </form>
  );
};

AccountNumberForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleClose: PropTypes.func,
};


export default withStyles(style)(AccountNumberForm);
