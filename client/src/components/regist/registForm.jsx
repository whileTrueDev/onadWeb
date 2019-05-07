import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import MaskedInput from 'react-text-mask';
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  InputAdornment,
  Button,
  Divider,
} from '@material-ui/core';

const encrpyto = require('./encryption');

const styles = theme => ({
  container: {
    display: 'block',
    flexWrap: 'wrap',
    width: 700,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: 0,
    marginBottom: theme.spacing.unit,
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
    marginLeft: theme.spacing.unit,
    marginRight: 0,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    width: 400,
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
});

const domains = [
  {
    value: 'naver.com',
  },
  {
    value: 'daum.net',
  },
  {
    value: 'nate.com',
  },
  {
    value: 'gmail.com',
  },
  {
    value: 'hotmail.com',
  },
  {
    value: 'yahoo.co.kr',
  },
];

class RegistForm extends React.Component {
  state = {
    id: '',
    password: '',
    name: '',
    email: '',
    companyNumber: '',
    domain: '',
    textmask: '',
    error: false,
    errorType: '',
    errorMessage: '',
  };

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
    const idReg = /^[a-z0-9]+[a-z0-9]{6,15}$/g;
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

  checkPassword = (event) => {
    const regx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
    this.setState({
      password: event.target.value,
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

  checkRePassword = (event) => {
    if (event.target.value === this.state.password) {
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
    let user;
    event.preventDefault();
    if (this.state.error) {
      alert(`${this.state.errorType} 입력 오류 입니다.`);
    } else {
      let key; let
        salt;
      [key, salt] = encrpyto.make(this.state.password);
      user = {
        marketerUserType: this.props.userType,
        marketerId: this.state.id,
        marketerPasswd: key,
        marketerSalt: salt,
        marketerName: this.state.name,
        marketerMail: `${this.state.email}@${this.state.domain}`,
        marketerBusinessRegNum: this.state.companyNumber,
        marketerPhoneNum: this.state.textmask,
      };
      this.props.handleUserInfo(user);
      this.props.handleNext();
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <form autoComplete="off" onSubmit={this.handleSubmit}>
          <TextField
            required
            label="ID"
            className={classes.textField}
            placeholder="아이디를 입력하세요"
            onChange={this.checkId}
            margin="normal"
            helperText={this.checkError('ID') ? this.state.errorMessage : ' '}
            error={this.checkError('ID')}
            InputLabelProps={{
              shrink: true,
            }}
            style={
            {
              width: 300,
            }
          }
          />
          <br />
          <TextField
            required
            label="PASSWORD"
            type="password"
            placeholder="비밀번호를 입력하세요."
            className={classes.textField}
            onChange={this.checkPassword}
            helperText={this.checkError('PASSWORD') ? this.state.errorMessage : ' '}
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
            helperText={this.checkError('RE-PASSWORD') ? this.state.errorMessage : ' '}
            error={this.checkError('RE-PASSWORD')}
            className={classes.textField}
            onChange={this.checkRePassword}
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
              value={this.state.textmask}
              onChange={this.handleChange('textmask')}
              id="phoneNumber"
              inputComponent={this.TextMaskCustom}
            />
            <FormHelperText>정보를 수신받을 전화번호를 입력하세요.</FormHelperText>
          </FormControl>
          <br />

          {this.props.userType
            ? (
              <FormControl className={classes.codeField}>
                <InputLabel shrink>사업자등록번호</InputLabel>
                <Input
                  onChange={this.handleChange('companyNumber')}
                  placeholder="사업자등록번호를 입력하세요"
                  endAdornment={(
                  <InputAdornment position="end">
        <Divider className={classes.divider} />
        <Button>
                    조회
                  </Button>
      </InputAdornment>
)}
                />
                <FormHelperText>{this.state.error ? this.state.errorMessage : '회사에 등록된 사업자 번호를 입력후 조회버튼을 누르세요.'}</FormHelperText>
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
            helperText={this.checkError('EMAIL') ? this.state.errorMessage : 'e-mail ID을 입력하세요.'}
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
            value={this.state.domain}
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
        Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              type="submit"
              value="Submit"
            >
        Next
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
