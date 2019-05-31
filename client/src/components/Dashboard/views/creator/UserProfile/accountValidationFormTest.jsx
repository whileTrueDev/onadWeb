import React from 'react';
// import PropTypes from 'prop-types';
import axios from 'axios';
import CustomInput from '../../../components/CustomInput/CustomInput';
import Button from '../../../components/CustomButtons/Button';

// import FindDialog from './FindDialog';

function getNowDate() {
  const date = new Date();
  const fullDate = date.getFullYear() + (`0${date.getMonth() + 1}`).slice(-2) + (`0${date.getDate()}`).slice(-2) + (`0${date.getHours()}`).slice(-2) + (`0${date.getMinutes()}`).slice(-2) + (`0${date.getSeconds()}`).slice(-2);
  return fullDate;
}

class EssayFormTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountNumber: '',
      bankSelector: '',
      account_holder_info: '',
      confirm: false,
    };
  }

  // 하나의 change로 값을 받을 수 있다.
  onChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  accountValidation = (event) => {
    const { bankSelector, accountNumber, idNumber } = this.state;
    const headers = {
      Authorization: 'Bearer d3608258-af4a-467a-8e33-d29bfbcd6ec0',
      'Content-Type': 'application/json',
    };
    console.log(bankSelector, accountNumber, idNumber, getNowDate());
    event.preventDefault();
    axios.post('https://testapi.open-platform.or.kr/inquiry/real_name', {
      bank_code_std: bankSelector,
      account_num: accountNumber,
      account_holder_info: idNumber,
      tran_dtime: getNowDate(),
    }, { headers })
      .then((res) => {
        let user;
        if (res.data.rsp_code === 'A0000') {
          this.setState({
            confirm: true,
          });
          user = {
            bankSelector,
            accountNumber,
          };
          axios.post('/validatedAccount', { user }).then(console.log('완료'));
        } else {
          alert('계좌인증에 실패하였습니다.');
        }
      });
  }

  render() {
    return (
      <form onChange={this.onChange}>
        <CustomInput
          labelText="계좌번호를 입력해주세요.('-'은 빼고 입력하세요.)"
          id="accountNumber"
          formControlProps={{
            fullWidth: true,
          }}
          inputProps={{
            type: 'number',
          }}
          value={this.state.accountNumber}
        />

        <select id="bankSelector" onChange={this.onChange.bind(this)} className="form-control">
          <option value="">은행을 선택하세요.</option>
          <option value="002">국민은행</option>
          <option value="기업은행">기업은행</option>
          <option value="우리은행">우리은행</option>
          <option value="수협">수협</option>
          <option value="신한은행">신한은행</option>
          <option value="부산은행">부산은행</option>
        </select>

        <CustomInput
          labelText="주민등록번호 앞 6자리를 입력해주세요."
          id="idNumber"
          formControlProps={{
            fullWidth: true,
          }}
          value={this.state.birth}
        />
        <Button
          color="primary"
          onClick={this.accountValidation}
        >
          계좌 입력
        </Button>
      </form>
    );
  }
}
export default EssayFormTest;
