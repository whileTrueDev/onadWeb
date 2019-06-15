import React, { useState } from 'react';
import {
  TextField,
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import axios from 'axios';
import Check from '@material-ui/icons/Check';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardBody from '../../../components/Card/CardBody';
import CardFooter from '../../../components/Card/CardFooter';
import Button from '../../../components/CustomButtons/Button';
import GridItem from '../../../components/Grid/GridItem';
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import Snackbar from '../../../components/Snackbar/Snackbar';

dashboardStyle.password = {
  width: '100%',
  marginTop: '15px',
  borderColor: '#00acc1',
  '& .MuiFormLabel-root ': {
    color: '#00acc1',
  },
  '& .MuiInputBase-input:before': {
    color: '#00acc1',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#00acc1',
  },
};

const PasswordForm = (props) => {
  const { classes } = props;
  const [rePasswordError, setRePasswordError] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  const snackClose = () => {
    setSnackOpen(false);
  };

  const checkRePassword = () => {
    const password = document.getElementById('password').value;
    const repassword = document.getElementById('repassword').value;
    if (password !== repassword) {
      setRePasswordError(true);
    } else {
      setRePasswordError(false);
    }
  };

  const submitPassword = (event) => {
    event.preventDefault();
    const password = document.getElementById('password').value;
    if (!rePasswordError) {
      axios.post('/login/changePw', { password })
        .then((res) => {
          setSnackOpen(true);
        });
    }
    document.getElementById('password').value = null;
    document.getElementById('repassword').value = null;
  };

  return (
    <Card>
      <CardHeader color="info">
        <h4 className={classes.cardTitleWhite}>
    비밀번호 변경
        </h4>
        <p className={classes.cardCategoryWhite}>변경할 비밀번호를 입력하세요.</p>
      </CardHeader>
      <form onSubmit={submitPassword}>
        <CardBody>
          <GridItem xs={12} sm={12} md={8}>
            <TextField
              required
              label="PASSWORD"
              type="password"
              id="password"
              placeholder="비밀번호를 입력하세요."
              helperText="특수문자를 포함한 8-20자 영문 또는 숫자"
              margin="dense"
              autoFocus
              className={classes.password}
              onChange={checkRePassword}
              inputProps={{
                required: '{true}',
                pattern: '^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$',
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={8}>
            <TextField
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
        autoHideDuration={3000}
        onClose={snackClose}
        message="비밀번호 변경 완료"
        open={snackOpen}
        icon={Check}
      />
    </Card>
  );
};

export default withStyles(dashboardStyle)(PasswordForm);
