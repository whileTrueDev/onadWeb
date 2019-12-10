import React, { useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Stepper, Step, StepLabel, StepContent,
} from '@material-ui/core';
import classnames from 'classnames';
import Check from '@material-ui/icons/Check';
import Dialog from '../../../atoms/Dialog/Dialog';
import BannerDescrForm from './BannerDescForm';
import './upload.css';
import ImageUpload from './ImageUpload';
import HOST from '../../../utils/config';
import axios from '../../../utils/axios';
import history from '../../../history';

const DEFAULT_IMAGE_PATH = '/pngs/dashboard/banner_upload_manual.png';

const dialogStyle = theme => ({
  formRoot: {
    margin: theme.spacing(2),
    padding: theme.spacing(1),
  },
});

const useQontoStepIconStyles = makeStyles({
  root: {
    color: '#eaeaf0',
    display: 'flex',
  },
  active: {
    color: '#00acc1',
  },
  circle: {
    width: 11,
    height: 11,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: '#00acc1',
    zIndex: 1,
    fontSize: 18,
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={classnames(classes.root, { [classes.active]: active })}
    >
      {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
    </div>
  );
}

const myReducer = (state, action) => {
  switch (action.type) {
    case 'reset': {
      return { imageName: '', imageUrl: DEFAULT_IMAGE_PATH };
    }
    case 'set': {
      return { imageName: action.imageName, imageUrl: action.imageUrl };
    }
    default: {
      return state;
    }
  }
};

const UploadDialog = (props) => {
  const {
    open, onClose, classes
  } = props;
  const [state, dispatch] = useReducer(myReducer, { imageName: '', imageUrl: DEFAULT_IMAGE_PATH });
  const [activeStep, setStep] = useState(0);

  const handleClose = () => {
    dispatch({ type: 'reset' });
    setStep(0);
    onClose();
  };

  const handleNext = number => () => {
    if (state.imageUrl !== DEFAULT_IMAGE_PATH) {
      setStep(number);
    } else {
      alert('파일을 선택하지 않았습니다.');
    }
  };

  // url을 제출.
  const handleSubmit = (event) => {
    event.preventDefault();
    const bannerDescription = document.getElementById('banner').value || null;
    const companyDescription = document.getElementById('company').value || null;
    // text format을 사용하기 위해 state로 사용한다.

    const landingUrl = document.getElementById('url').value || null;

    axios.post(`${HOST}/api/dashboard/marketer/banner/push`, {
      bannerSrc: state.imageUrl, bannerDescription, companyDescription, landingUrl,
    })
      .then((res) => {
        if (res.data[0]) {
          alert(res.data[1]);
          history.push(window.location.pathname);
        } else {
          alert('현재는 등록할 수 없습니다. 본사에 문의하세요');
        }
        handleClose();
      });
  };


  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullWidth
      title="배너 등록"
    >
      <Stepper activeStep={activeStep} orientation="vertical" style={{ padding: 0 }}>
        <Step key="0">
          <StepLabel StepIconComponent={QontoStepIcon}>
            배너 이미지 등록
          </StepLabel>
          <StepContent>
            <ImageUpload
              handleClose={handleClose}
              handleNext={handleNext}
              state={state}
              dispatch={dispatch}
            />
          </StepContent>
        </Step>
        <Step key="1">
          <StepLabel StepIconComponent={QontoStepIcon}>
            배너 상세정보 입력
          </StepLabel>
          <StepContent className={classes.formRoot}>
            <BannerDescrForm
              handleNext={handleNext}
              state={state}
              handleSubmit={handleSubmit}
            />
          </StepContent>
        </Step>
      </Stepper>
    </Dialog>
  );
};


UploadDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

QontoStepIcon.propTypes = {
  active: PropTypes.bool.isRequired,
  completed: PropTypes.bool.isRequired,
};

export default withStyles(dialogStyle)(UploadDialog);
