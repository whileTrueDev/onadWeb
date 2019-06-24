import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  withStyles,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@material-ui/core';
import Usertype from './Usertype';
import RegistForm from './RegistForm';
import PaperSheet from './Paper';
import AppAppBar from '../Main/views/AppAppBar';


const styles = theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(1) * 3,
  },
});

const RegistStepper = (props) => {
  const {
    classes, history,
  } = props;
  const [activeStep, setStep] = useState(0);
  const [userType, setType] = useState(0);
  const [userInfo, setInfo] = useState({});

  const handleNext = () => {
    setStep(activeStep + 1);
  };

  const handleBack = () => {
    setStep(activeStep - 1);
  };

  const handleReset = () => {
    setStep(0);
  };

  const typeChange = (type) => {
    setType(type);
  };

  const handleUserInfo = (user) => {
    setInfo(user);
  };

  const handleUserSubmit = () => {
    axios.post('/regist/marketer',
      userInfo)
      .then((res) => {
        const { error } = res.data;
        if (!error) {
          alert('등록한 이메일로 인증메일을 발송하였습니다. 이메일을 확인하세요!');
          history.push('/');
        } else {
          alert('등록중 오류가 났습니다. 다시 회원가입을 시작하세요.');
          history.push('/');
        }
      });
  };

  return (
    <div className={classes.root}>
      <AppAppBar />
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step key="0">
          <StepLabel>사업자 유형 선택</StepLabel>
          <StepContent>
            <Usertype typeChange={typeChange} handleNext={handleNext} />
          </StepContent>
        </Step>
        <Step key="1">
          <StepLabel>개인정보 입력</StepLabel>
          <StepContent>
            <RegistForm
              userType={userType}
              handleNext={handleNext}
              handleBack={handleBack}
              handleUserInfo={handleUserInfo}
            />
          </StepContent>
        </Step>
        <Step key="2">
          <StepLabel>정보 동의 및 계약</StepLabel>
          <StepContent>
            <PaperSheet
              handleNext={handleNext}
              handleReset={handleReset}
              handleUserSubmit={handleUserSubmit}
            />
          </StepContent>
        </Step>
      </Stepper>
    </div>
  );
};

RegistStepper.propTypes = {
  history: PropTypes.object.isRequired,
  classes: PropTypes.object,
};

RegistStepper.defaultProps = {
  classes: {},
};

export default withStyles(styles)(RegistStepper);
