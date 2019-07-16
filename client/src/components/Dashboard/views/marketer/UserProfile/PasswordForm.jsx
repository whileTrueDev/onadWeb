import React, { useState, useReducer } from 'react';
import {
  TextField,
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import Check from '@material-ui/icons/Check';
import axios from '../../../../../utils/axios';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardBody from '../../../components/Card/CardBody';
import CardFooter from '../../../components/Card/CardFooter';
import Button from '../../../components/CustomButtons/Button';
import GridItem from '../../../components/Grid/GridItem';
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import Snackbar from '../../../components/Snackbar/Snackbar';
import HOST from '../../../../../config';

const initialValue = {
  value: '',
  password: false,
  repasswd: false,
};

// reducer를 사용하여 Error를 handling하자
const myReducer = (state, action) => {
  switch (action.type) {
    case 'password': {
      const regx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
      if (regx.test(action.value)) {
        return { ...state, value: action.value, password: false };
      }
      return { ...state, value: action.value, password: true };
    }
    case 'repasswd': {
      if (state.value === action.value) {
        return { ...state, repasswd: false };
      }
      return { ...state, repasswd: true };
    }
    default: {
      return state;
    }
  }
};

const PasswordForm = (props) => {
  const { classes } = props;
  const [state, dispatch] = useReducer(myReducer, initialValue);
  const [snackOpen, setSnackOpen] = useState(false);

  const checkPasswd = (event) => {
    event.preventDefault();
    dispatch({ type: 'password', value: event.target.value });
  };

  const checkRePasswd = (event) => {
    event.preventDefault();
    dispatch({ type: 'repasswd', value: event.target.value });
  };

  const submitPassword = (event) => {
    event.preventDefault();
    if (!(state.password || state.repasswd)) {
      axios.post(`${HOST}/api/login/changePw`, { password: state.value })
        .then((res) => {
          if (res.data) {
            setSnackOpen(true);
          }
        });
    }
    document.getElementById('password').value = null;
    document.getElementById('repassword').value = null;
  };

  return (
    <Card>
      <CardHeader color="blueGray">
        <h4 className={classes.cardTitleWhite}>
          비밀번호 변경
        </h4>
        <p className={classes.cardCategoryWhite}>변경할 비밀번호를 입력하세요.</p>
      </CardHeader>
      <form onSubmit={submitPassword}>
        <CardBody>
          <GridItem xs={12} sm={12} md={12}>
            <TextField
              required
              label="PASSWORD"
              type="password"
              id="password"
              placeholder="비밀번호를 입력하세요."
              onChange={checkPasswd}
              helperText={state.password ? '특수문자를 포함한 영문/숫자 혼합 8자리 이상입니다.' : ' '}
              error={state.password}
              margin="normal"
              autoFocus
              InputLabelProps={{
                shrink: true,
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            {/* <TextField
              required
              type="password"
              label="RE-PASSWORD"
              id="repassword"
              placeholder="비밀번호를 재입력하세요."
              onChange={checkRePassword}
              helperText={rePasswordError ? '비밀번호와 일치하지 않습니다.' : ' '}
              error={rePasswordError}
              margin="dense"
              className={classes.password}
              InputLabelProps={{
                shrink: true,
              }}
            /> */}
            <TextField
              required
              type="password"
              label="RE-PASSWORD"
              placeholder="비밀번호를 재입력하세요."
              helperText={state.repasswd ? '비밀번호와 동일하지 않습니다.' : ' '}
              error={state.repasswd}
              onChange={checkRePasswd}
              margin="normal"
              id="repassword"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </GridItem>
        </CardBody>
        <CardFooter>
          <Button type="submit" value="Submit" color="info">확인</Button>
        </CardFooter>
      </form>
      <Snackbar
        place="tr"
        color="success"
        message="비밀번호 변경 완료"
        open={snackOpen}
        icon={Check}
        closeNotification={() => { setSnackOpen(false); }}
        close
      />
    </Card>
  );
};

export default withStyles(dashboardStyle)(PasswordForm);
