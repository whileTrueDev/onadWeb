import React from 'react';
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


const styles = theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
});

function getSteps() {
  return ['사업자 유형 선택', '개인정보 입력', '정보 동의 및 계약'];
}

function getStepContent(step, typeChange, handleNext, handleBack, userType, handleUserInfo) {
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
      return <PaperSheet />;
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


  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep, userType } = this.state;
    return (
      <div className={classes.root}>
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
                  this.handleUserInfo)}
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
