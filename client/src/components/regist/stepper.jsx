import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  withStyles,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@material-ui/core';
import Usertype from './usertype';
import RegistForm from './registForm';
import PaperSheet from './paper';
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

function getSteps() {
  return ['사업자 유형 선택', '개인정보 입력', '정보 동의 및 계약'];
}

function getStepContent(step, typeChange, handleNext, handleBack, userType, handleUserInfo, handleReset, handleUserSubmit) {
  switch (step) {
    case 0:
      return <Usertype typeChange={typeChange} handleNext={handleNext} />;
    case 1:
      return (
        <RegistForm
          userType={userType}
          handleNext={handleNext}
          handleBack={handleBack}
          handleUserInfo={handleUserInfo}
        />
      );
    case 2:
      return <PaperSheet handleNext={handleNext} handleReset={handleReset} handleUserSubmit={handleUserSubmit}/>;
    default:
      return 'Unknown step';
  }
}

class RegistStepper extends React.Component {
  state = {
    activeStep: 0,
    userType: 0,
    userInfo: {},
  };

  // 이 페이지에 라우팅 되어 들어오면 (다른 페이지에서 여기로) 스크롤을 맨 위로 올린다.
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  typeChange = (type) => {
    this.setState({
      userType: type,
    });
  }

  handleUserInfo = (user) => {
    this.setState({
      userInfo: user,
    });
  }

  handleUserSubmit = (event) => { 
    axios.post('/regist/marketer',
      this.state.userInfo,  
    )
    .then((res) => {
      this.props.history.push('/');
    })
    .catch((error) => {
      alert('등록중 오류가 났습니다. 다시 회원가입을 시작하세요.');
    });
  }

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep, userType } = this.state;
    return (
      <div className={classes.root}>
        <AppAppBar />
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                {getStepContent(index,
                  this.typeChange,
                  this.handleNext,
                  this.handleBack,
                  userType,
                  this.handleUserInfo,
                  this.handleReset,
                  this.handleUserSubmit)}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </div>
    );
  }
}

RegistStepper.propTypes = {
  classes: PropTypes.object,
};

RegistStepper.defaultProps = {
  classes: {},
};

export default withStyles(styles)(RegistStepper);
