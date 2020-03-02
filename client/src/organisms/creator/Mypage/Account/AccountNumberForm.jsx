// AccountNumber를 입력하는 Form component 작성
import React, { useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import {
  DialogActions,
  TextField,
  withStyles,
  MenuItem,
  Grid,
} from '@material-ui/core';
import NumberFormat from 'react-number-format';
import StyledInput from '../../../../atoms/StyledInput';
import axios from '../../../../utils/axios';
import Button from '../../../../atoms/CustomButtons/Button';
import HOST from '../../../../utils/config';
import history from '../../../../history';
import StyledItemText from '../../../../atoms/StyledItemText';

const style = theme => ({
  divider: {
    width: 2,
    height: 28,
    margin: 4,
  },
  textField: {
    width: '180px',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    },
    marginBottom: theme.spacing(1),
    minWidth: 120,
  },
  item: {
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
        code: banks.find(_bank => _bank.bankName === action.name).bankCode
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
      <Grid container direction="column" justify="center" spacing={2}>
        <Grid item>
          <Grid container direction="column">
            <Grid item className={classes.item}>
              <StyledItemText primary="은행" secondary="은행을 선택하세요." fontSize="14px" />
            </Grid>
            <Grid item className={classes.item}>
              <TextField
                required
                select
                name="bank"
                id="bank"
                className={classes.textField}
                value={bankState.name || ''}
                onChange={handleChangeBank}
                style={{ width: '40%' }}
                margin="dense"
              >
                {banks.map((row) => {
                  const name = row.bankName;
                  return <MenuItem key={name} value={name}>{name}</MenuItem>;
                })}
              </TextField>
            </Grid>
          </Grid>
        </Grid>
        <Grid container direction="column">
          <Grid item className={classes.item}>
            <StyledItemText primary="예금주" secondary=" 해당 계좌의 예금주를 입력해주세요" fontSize="13px" />
          </Grid>
          <Grid item className={classes.item}>
            <TextField
              required
              value={realName}
              onChange={onRealNameChange}
              margin="dense"
              className={classes.textField}
              name="userName"
              style={{ width: '200px' }}
            />
          </Grid>
        </Grid>

        <Grid container direction="column">
          <Grid item className={classes.item}>
            <StyledItemText primary="주민번호 앞자리" fontSize="13px" />
          </Grid>
          <Grid item className={classes.item}>
            <NumberFormat
              required
              value={birth}
              onValueChange={onBirthChange}
              customInput={StyledInput}
              className={classes.textField}
              margin="dense"
              style={{ width: '200px' }}
              allowNegative={false}
              allowLeadingZeros={true}
            />
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="column">
            <Grid item className={classes.item}>
              <StyledItemText primary="계좌번호" secondary=" (-)을 제외한 계좌번호를 입력하세요" fontSize="14px" />
            </Grid>
            <Grid container direction="row" className={classes.item}>
              <Grid item>
                <NumberFormat
                  required
                  value={accountNum}
                  onValueChange={onAccountChange}
                  customInput={StyledInput}
                  margin="dense"
                  className={classes.textField}
                  style={{ width: '250px' }}
                  allowNegative={false}
                  allowLeadingZeros
                />
              </Grid>
              <Grid item>
                <Button size="sm" color="blueGray" onClick={accountValidation}>조회</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <DialogActions>
            <Button
              type="submit"
              value="Submit"
              color="primary"
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
        </Grid>
      </Grid>
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
