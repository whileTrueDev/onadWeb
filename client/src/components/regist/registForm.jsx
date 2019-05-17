import React from 'react';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  InputAdornment,
  Button,
  Divider,
  withStyles,
  MenuItem,
  TextField,
} from '@material-ui/core';
import axios from 'axios';

// Style Overriding용.
const styles = theme => ({
  container: {
    display: 'block',
    flexWrap: 'wrap',
    width: 700,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: 0,
    marginBottom: theme.spacing(1),
    width: 250,
  },
  menu: {
    width: 200,
  },
  divider: {
    width: 2,
    height: 28,
    margin: 4,
  },
  codeField: {
    marginLeft: theme.spacing(1),
    marginRight: 0,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: 400,
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
});

// domain select용.
const domains = [
  { value: 'naver.com' },
  { value: 'daum.net' },
  { value: 'nate.com' },
  { value: 'gmail.com' },
  { value: 'hotmail.com' },
  { value: 'yahoo.co.kr' },
];


class RegistForm extends React.Component {
  state = {
    id: '',
    passwd: '',
    name: '',
    email: '',
    businessRegNum: 'null',
    domain: '',
    phoneNum: '',
    error: false,
    errorType: '',
    errorMessage: '',
    checkDuplication : false,
  };

  // handle을 전달.

  handleChange = name => (event) => {
    this.setState({ [name]: event.target.value });
  };

  checkError = (type) => {
    if (this.state.error && this.state.errorType === type) {
      return true;
    }
    return false;
  }

  checkId = (event) => {
    const idReg = /^[A-za-z]+[a-z0-9]{4,15}$/g;
    this.setState({
      id: event.target.value,
    });
    if (idReg.test(event.target.value)) {
      this.setState({
        error: false,
      });
    } else {
      this.setState({
        errorType: 'ID',
        error: true,
        errorMessage: '영문자로 시작하는 6-20자 영문 또는 숫자',
      });
    }
  }

  checkEmail = (event) => {
    const idReg = /^[a-z0-9]+[a-z0-9]{4,15}$/g;
    this.setState({
      email: event.target.value,
    });
    if (idReg.test(event.target.value)) {
      this.setState({
        error: false,
      });
    } else {
      this.setState({
        errorType: 'EMAIL',
        error: true,
        errorMessage: '너무짧습니다.',
      });
    }
  }

  checkPasswd = (event) => {
    const regx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
    this.setState({
      passwd: event.target.value,
    });
    if (regx.test(event.target.value)) {
      this.setState({
        error: false,
      });
    } else {
      this.setState({
        errorType: 'PASSWORD',
        error: true,
        errorMessage: '특수문자를 포함한 8-20자 영문 또는 숫자',
      });
    }
  }

  checkRePasswd = (event) => {
    if (event.target.value === this.state.passwd) {
      this.setState({
        error: false,
      });
    } else {
      this.setState({
        errorType: 'RE-PASSWORD',
        error: true,
        errorMessage: '비밀번호와 동일하지 않습니다.',
      });
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let user;

    if(!this.state.checkDuplication){
      alert('ID 중복조회를 해주세요.')
    }else{
      if (this.state.error) {
        alert(`${this.state.errorType} 입력 오류 입니다.`);
      } else {
        user = {
          marketerId: this.state.id,
          marketerRawPasswd : this.state.passwd,
          marketerName: this.state.name,
          marketerMail: `${this.state.email}@${this.state.domain}`,
          marketerPhoneNum: this.state.phoneNum,   
          marketerBusinessRegNum: this.state.businessRegNum,
          marketerUserType: this.props.userType,
        };
        this.props.handleUserInfo(user);
        this.props.handleNext();
      }
    }
  }

  TextMaskCustom(props) {
    const { inputRef, ...other } = props;
    return (
      <MaskedInput
        {...other}
        ref={(ref) => {
          inputRef(ref ? ref.inputElement : null);
        }}
        mask={['(', ' ', /\d/, /\d/, /\d/, ' ', ')', ' ', '-', ' ', /\d/, /\d/, /\d/, /\d/, ' ', '-', ' ', /\d/, /\d/, /\d/, /\d/]}
        placeholderChar={'\u2000'}
        showMask
        style={{
          fontSize: 17,
          width: 200,
        }}
      />
    );
  }

  checkBusinessRegNum = (event) => {
    alert('준비 중입니다. 회원가입을 진행해 주세요.');
  }

  checkDuplicateID = (event) => {
    if(this.state.id === ''){
      this.setState({
        errorType: 'ID',
        error: true,
        errorMessage: '아무것도 입력하지 않았습니다.',
      });
    }else{
      axios.post('/regist/checkId',{
        id : this.state.id
      })
      .then((res)=>{
        if(res.data){
          this.setState({
            errorType: 'ID',
            error: true,
            errorMessage: 'ID가 중복되었습니다.',
          });
        }else{
          alert('회원가입이 가능합니다. 계속 진행하세요.');
          this.setState({
            error: false,
            checkDuplication : true
          });
        }

      })
      .catch((err)=>{
        console.log(err);
      })
    }
  }

  render() {
    const { classes } = this.props;
    const {
      errorMessage,
      textmask,
      domain,
    } = this.state;

    return (
      <div className={classes.container}>
        <form autoComplete="off" onSubmit={this.handleSubmit}>
          <FormControl className={classes.codeField}
            error={this.checkError('ID')}
          >
            <InputLabel shrink>ID</InputLabel>
            <Input
              required
              onChange={this.checkId}
              placeholder="아이디를 입력하세요"
              style={{ width: 300,}}
              endAdornment={(
                <InputAdornment position="end">
                  <Divider className={classes.divider} />
                  <Button onClick={this.checkDuplicateID}>
                    조회
                  </Button>
                </InputAdornment>
              )}
            />
            <FormHelperText>{this.checkError('ID') ? errorMessage : ' '}</FormHelperText>
          </FormControl>
          <br />
          <TextField
            required
            label="PASSWORD"
            type="password"
            placeholder="비밀번호를 입력하세요."
            className={classes.textField}
            onChange={this.checkPasswd}
            helperText={this.checkError('PASSWORD') ? errorMessage : ' '}
            error={this.checkError('PASSWORD')}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            style={
            {
              marginRight: 10,
            }
          }
          />
          <TextField
            required
            label="RE-PASSWORD"
            type="password"
            placeholder="비밀번호를 재입력하세요."
            helperText={this.checkError('RE-PASSWORD') ? errorMessage : ' '}
            error={this.checkError('RE-PASSWORD')}
            className={classes.textField}
            onChange={this.checkRePasswd}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            required
            label="이름(회사명)"
            className={classes.textField}
            placeholder="이름(회사명)을 입력하세요"
            onChange={this.handleChange('name')}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            style={
            {
              width: 300,
              marginRight: 10,
            }
          }
          />

          <FormControl
            className={classes.textField}
            required
            margin="normal"
            style={{ width: 220 }}
          >
            <InputLabel shrink htmlFor="phoneNumber">전화번호</InputLabel>
            <Input
              value={textmask}
              onChange={this.handleChange('phoneNum')}
              id="phoneNumber"
              inputComponent={this.TextMaskCustom}
            />
            <FormHelperText>전화번호를 입력하세요.</FormHelperText>
          </FormControl>
          <br />

          {this.props.userType
            ? (
              <FormControl className={classes.codeField}>
                <InputLabel shrink>사업자등록번호</InputLabel>
                <Input
                  onChange={this.handleChange('businessRegNum')}
                  placeholder="사업자등록번호를 입력하세요"
                  endAdornment={(
                    <InputAdornment position="end">
                      <Divider className={classes.divider} />
                      <Button onClick={this.checkBusinessRegNum}>
                        조회
                      </Button>
                    </InputAdornment>
                  )}
                />
                <FormHelperText>회사에 등록된 사업자 번호를 입력후 조회버튼을 누르세요.</FormHelperText>
              </FormControl>
            )
            : <div />
          }
          <br />

          <TextField
            required
            label="EMAIL ID"
            className={classes.textField}
            onChange={this.checkEmail}
            helperText={this.checkError('EMAIL') ? errorMessage : 'e-mail ID을 입력하세요.'}
            error={this.checkError('EMAIL')}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">@</InputAdornment>,
            }}
            style={
            {
              width: 200,
            }
          }
          />

          <TextField
            required
            select
            label="Domain"
            className={classes.textField}
            value={domain}
            onChange={this.handleChange('domain')}
            helperText="e-mail Domain을 선택하세요."
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            style={
            {
              width: 200,
            }
          }
          >
            {domains.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.value}
              </MenuItem>
            ))}
          </TextField>
          <div className={classes.actionsContainer}>
            <Button
              onClick={this.props.handleBack}
              className={classes.button}
            >
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
        </form>
      </div>
    );
  }
}

RegistForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegistForm);
