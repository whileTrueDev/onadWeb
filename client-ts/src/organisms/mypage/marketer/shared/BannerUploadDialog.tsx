import React, { useReducer, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Stepper, Step, StepLabel, StepContent,
} from '@material-ui/core';
import classnames from 'classnames';
import Check from '@material-ui/icons/Check';
import Dialog from '../../../../atoms/Dialog/Dialog';
// import BannerDescForm from './BannerDescForm';
import './upload.css';
import ImageUpload from './ImageUpload';
import HOST from '../../../../utils/config';
import axios from '../../../../utils/axios';

const DEFAULT_IMAGE_PATH = '/pngs/dashboard/banner_upload_manual.png';

const useStyle = makeStyles((theme: Theme) => ({
  formRoot: {
    margin: theme.spacing(2),
    padding: theme.spacing(1),
  },
}));

const useQontoStepIconStyles = makeStyles((theme: Theme) => ({
  root: { color: theme.palette.background.paper, display: 'flex', },
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

function QontoStepIcon(props: any): JSX.Element {
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
        const strUrl = String.fromCharCode.apply(
          null, Array.from(new Uint16Array(action.imageUrl))
        );
        return { imageName: action.imageName, imageUrl: strUrl };
      }
      return { imageName: action.imageName, imageUrl: action.imageUrl };
    }
    default: {
      return state;
    }
  }
};

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  recallRequest?: () => void;
}

const UploadDialog = (props: UploadDialogProps): JSX.Element => {
  const {
    open, onClose, recallRequest
  } = props;
  const classes = useStyle();
  const [state, dispatch] = useReducer(myReducer, { imageName: '', imageUrl: DEFAULT_IMAGE_PATH });
  const [activeStep, setStep] = useState(0);
  const handleClose = (): void => {
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

  // // usePostRequest 수정 이후 적용
  // const {
  //   data, loading, error, doPostRequest
  // } = usePostRequest<{ bannerSrc: string; bannerDescription: string }, boolean[]>(
  //   '/marketer/banner');

  // url을 제출.
  const handleSubmit = (): void => {
    // const bannerDescription = (document.getElementById('banner') as HTMLInputElement).value || '';
    // // usePostRequest 수정 이후 적용
    // if (state.imageUrl) {
    //   doPostRequest({
    //     bannerSrc: state.imageUrl, bannerDescription,
    //   });
    //   if (recallRequest) {
    //     recallRequest();
    //   }
    // }
    axios.post(`${HOST}/marketer/banner`, {
      bannerSrc: state.imageUrl
    })
      .then((res) => {
        if (res.data[0]) {
          alert(res.data[1]);
          if (recallRequest) {
            recallRequest();
          }
        } else {
          alert('현재는 등록할 수 없습니다. 잠시 후 다시 시도해주세요.');
        }
        handleClose();
      });
  };
  // text format을 사용하기 위해 state로 사용한다.


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
              handleSubmit={handleSubmit}
              state={state}
              dispatch={dispatch}
            />
          </StepContent>
        </Step>
      </Stepper>
    </Dialog>
  );
};


export default UploadDialog;
