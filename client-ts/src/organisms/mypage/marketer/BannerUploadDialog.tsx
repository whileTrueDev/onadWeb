import React, { useReducer, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Stepper, Step, StepLabel, StepContent,
} from '@material-ui/core';
import classnames from 'classnames';
import Check from '@material-ui/icons/Check';
import Dialog from '../../../atoms/Dialog/Dialog';
import BannerDescForm from './BannerDescForm';
import './upload.css';
import ImageUpload from './ImageUpload';
import HOST from '../../../utils/config';
import axios from '../../../utils/axios';
import history from '../../../history';

const DEFAULT_IMAGE_PATH = '/pngs/dashboard/banner_upload_manual.png';

const useStyle = makeStyles((theme: Theme) => ({
  formRoot: {
    margin: theme.spacing(2),
    padding: theme.spacing(1),
  },
}));

const useQontoStepIconStyles = makeStyles((theme: Theme) => ({
  root: {
    color: '#eaeaf0',
    display: 'flex',
  },
  active: {
    color: theme.palette.primary.main,
  },
  circle: {
    width: 11,
    height: 11,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: theme.palette.primary.main,
    zIndex: 1,
    fontSize: 18,
  },
  formRoot: {
    margin: theme.spacing(2),
    padding: theme.spacing(1),
  },
}));

function QontoStepIcon(props: any) {
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

interface ImageInterface {
  imageName?: string;
  imageUrl?: string;
}

interface ImageAction {
  type: string;
  imageName?: string;
  imageUrl?: string | ArrayBuffer;
}

const myReducer = (state: ImageInterface, action: ImageAction): ImageInterface => {
  switch (action.type) {
    case 'reset': {
      return { imageName: '', imageUrl: DEFAULT_IMAGE_PATH };
    }
    case 'set': {
      if (action.imageUrl && typeof action.imageUrl !== 'string') {
        // ArrayBuffer to String에 대한 test가 필요하다. => 안되면 any를 하자.
        const strUrl = String.fromCharCode.apply(null, Array.from(new Uint16Array(action.imageUrl)));
        return { imageName: action.imageName, imageUrl: strUrl };
      } else {
        return { imageName: action.imageName, imageUrl: action.imageUrl };
      }
    }
    default: {
      return state;
    }
  }
};

interface propInterface {
  open: boolean;
  onClose: () => void;
  isCampaignPage: boolean;
  recallRequest: () => void;
}

const UploadDialog = (props: propInterface) => {
  const {
    open, onClose, isCampaignPage, recallRequest
  } = props;
  const classes = useStyle();
  const [state, dispatch] = useReducer(myReducer, { imageName: '', imageUrl: DEFAULT_IMAGE_PATH });
  const [activeStep, setStep] = useState(0);

  const handleClose = () => {
    dispatch({ type: 'reset' });
    setStep(0);
    onClose();
  };

  const handleNext = (number: number) => (): void => {
    if (state.imageUrl !== DEFAULT_IMAGE_PATH) {
      setStep(number);
    } else {
      alert('파일을 선택하지 않았습니다.');
    }
  };

  // url을 제출.
  const handleSubmit = () => {
    const bannerDescription = (document.getElementById('banner') as HTMLInputElement).value || null;
    // text format을 사용하기 위해 state로 사용한다.

    axios.post(`${HOST}/api/dashboard/marketer/banner/push`, {
      bannerSrc: state.imageUrl, bannerDescription,
    })
      .then((res) => {
        if (res.data[0]) {
          alert(res.data[1]);
          if (!isCampaignPage) {
            history.push(window.location.pathname);
          } else { recallRequest(); }
        } else {
          alert('현재는 등록할 수 없습니다. 잠시 후 다시 시도해주세요.');
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
            홍보문구 입력
          </StepLabel>
          <StepContent className={classes.formRoot}>
            <BannerDescForm
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


export default UploadDialog;
