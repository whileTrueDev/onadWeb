import { Button, Collapse, Step, StepContent, StepLabel, Stepper } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Check from '@material-ui/icons/Check';
import classnames from 'classnames';
import { useReducer, useState } from 'react';
import Dialog from '../../../../atoms/Dialog/Dialog';
import { useMarketerCreateBannerMutation } from '../../../../utils/hooks/mutation/useMarketerCreateBannerMutation';
import BannerUpload from './sub/BannerUpload';
// import BannerDescForm from './BannerDescForm';
import './upload.css';

const DEFAULT_IMAGE_PATH = '/pngs/dashboard/banner_upload_manual.png';

const useQontoStepIconStyles = makeStyles((theme: Theme) => ({
  root: { color: theme.palette.background.paper, display: 'flex' },
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
    <div className={classnames(classes.root, { [classes.active]: active })}>
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
          null,
          Array.from(new Uint16Array(action.imageUrl)),
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
  onSuccess?: () => void;
  failCallback?: (e: any) => void;
}

const UploadDialog = (props: UploadDialogProps): JSX.Element => {
  const { open, onClose, onSuccess, failCallback } = props;
  const [state, dispatch] = useReducer(myReducer, { imageName: '', imageUrl: DEFAULT_IMAGE_PATH });
  const [activeStep, setStep] = useState(0);
  const handleClose = (): void => {
    dispatch({ type: 'reset' });
    setStep(0);
    onClose();
  };

  // 배너를 등록 함수
  const createBanner = useMarketerCreateBannerMutation();
  const handleSubmit = (): void => {
    createBanner
      .mutateAsync({ bannerSrc: state.imageUrl })
      .then(res => {
        if (res.data[0]) {
          alert(res.data[1]);
          if (onSuccess) onSuccess();
        } else {
          alert('배너 등록 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
        handleClose();
      })
      .catch(e => {
        if (failCallback) failCallback(e);
        else {
          alert('배너 등록 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
      });
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullWidth
      title="배너 등록"
      buttons={
        <div style={{ display: 'flex' }}>
          <Collapse in={Boolean(state.imageUrl && state.imageUrl !== DEFAULT_IMAGE_PATH)}>
            <Button
              color="primary"
              variant="contained"
              disabled={createBanner.isLoading}
              onClick={handleSubmit}
            >
              등록
            </Button>
          </Collapse>
          <Button variant="contained" onClick={handleClose}>
            취소
          </Button>
        </div>
      }
    >
      <Stepper activeStep={activeStep} orientation="vertical" style={{ padding: 0 }}>
        <Step key="0">
          <StepLabel StepIconComponent={QontoStepIcon}>배너 이미지 등록</StepLabel>
          <StepContent>
            <BannerUpload
              image={state}
              onReset={(): void => dispatch({ type: 'reset' })}
              onSucess={(image): void => {
                dispatch({
                  type: 'set',
                  imageName: image.imageName,
                  imageUrl: image.imageUrl,
                });
              }}
            />
          </StepContent>
        </Step>
      </Stepper>
    </Dialog>
  );
};

export default UploadDialog;
