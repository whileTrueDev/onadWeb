import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Stepper from '@material-ui/core/Stepper';
import { Step, StepLabel } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import BallotIcon from '@material-ui/icons/Ballot';
import BrandingWatermarkIcon from '@material-ui/icons/BrandingWatermark';
import StepConnector from '@material-ui/core/StepConnector';

/*
2019-09-17 박찬우

확장성을 고려하지 않은 Linear Stepper
*/

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  completed: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

const StyledStepLabel = withStyles(theme => ({
  label: {
    fontSize: '16px',
    fontWeight: '700',
    '&.MuiStepLabel-active': {
      fontWeight: '700',
      color: 'rgb(242,113,33)',
    },
    '&.MuiStepLabel-completed': {
      fontWeight: '700',
      color: 'rgb(242,113,33)',
    },
  },
  alternativeLabel: {
    fontSize: '16px',
    fontWeight: '700',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px',
    },
  }
}))(StepLabel);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  },
});


function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed, icon } = props;

  const icons = {
    1: <CreateIcon />,
    2: <BallotIcon />,
    3: <BrandingWatermarkIcon />,
  };

  return (
    <div
      className={classnames(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(icon)]}
    </div>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

export default function HorizontalLinearStepper(props) {
  const { steps, activeStep, ...rest } = props;

  return (
    <div {...rest}>
      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />} style={{ padding: '10px' }}>
        {steps.map(content => (
          <Step key={content.label}>
            <StyledStepLabel StepIconComponent={ColorlibStepIcon}>
              {content.label}
            </StyledStepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}

HorizontalLinearStepper.propTypes = {
  steps: PropTypes.array,
  activeStep: PropTypes.number,
};

// steps는 bannerId, bannerSrc 라는 col이 존재해야한다.
HorizontalLinearStepper.defaultProps = {
  steps: [{ label: '캠페인 기본정보 / 배너선택' }, { label: '광고우선순위 선택' }, { label: '광고유형 선택' }],
};
