import { Button, Step, StepContent, StepLabel, Stepper } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Check from '@material-ui/icons/Check';
import classnames from 'classnames';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import Dialog from '../../../../atoms/dialog/dialog';
import { useMarketerCreateLandingUrlMutation } from '../../../../utils/hooks/mutation/useMarketerCreateLandingUrlMutation';
import useEventTargetValue from '../../../../utils/hooks/useEventTargetValue';
import useToggle from '../../../../utils/hooks/useToggle';
import landingUrlRegex from '../../../../utils/inputs/regex/landing-url.regex';
import UrlUploadStep from './urlUploadStep';

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
interface UrlUploadDialogProps {
  open: boolean;
  handleClose: () => void;
  onSuccess?: () => void;
}

function QontoStepIcon(props: any): JSX.Element {
  const classes2 = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div className={classnames(classes2.root, { [classes2.active]: active })}>
      {completed ? <Check className={classes2.completed} /> : <div className={classes2.circle} />}
    </div>
  );
}

export default function UrlUploadDialog(props: UrlUploadDialogProps): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const { open, handleClose, onSuccess } = props;
  const [activeStep] = useState(0);

  const subOpen = useToggle(); // Toggle for sub-urls
  const mainUrl = useEventTargetValue('https://'); // Main url
  const mainUrlName = useEventTargetValue(); // Main url name

  const subUrl = useEventTargetValue('https://'); // Sub url
  const subUrlName = useEventTargetValue(); // sub url name
  const subUrlCheck = useToggle(true); // Sub url2 설정/미설정

  const sub2Url = useEventTargetValue('https://'); // Sub url2
  const sub2UrlName = useEventTargetValue(); // Sub url2 name
  const sub2UrlCheck = useToggle(true); // Sub url2 설정/미설정

  const createLandingUrl = useMarketerCreateLandingUrlMutation();

  function handleSubmit(): void {
    const linkResult = [];
    linkResult.push({
      primary: true,
      linkName: mainUrlName.value,
      linkTo: mainUrl.value,
    });
    if (!subUrlCheck.toggle) {
      linkResult.push({ primary: false, linkName: subUrlName.value, linkTo: subUrl.value });
    }
    if (!sub2UrlCheck.toggle) {
      linkResult.push({ primary: false, linkName: sub2UrlName.value, linkTo: sub2Url.value });
    }

    createLandingUrl.mutateAsync({ links: linkResult }).then(() => {
      handleClose();
      enqueueSnackbar('랜딩페이지URL 등록 완료', { variant: 'success' });
      if (onSuccess) onSuccess();
    });
  }
  const handleDialogClose = (): void => {
    // Reset values
    mainUrl.handleReset();
    mainUrlName.handleReset();
    subUrl.handleReset();
    subUrlName.handleReset();
    sub2Url.handleReset();
    sub2UrlName.handleReset();
    handleClose();
  };

  function isLengthValid(): boolean {
    return !(
      mainUrlName.value.length > 20 ||
      subUrlName.value.length > 20 ||
      sub2UrlName.value.length > 20
    );
  }
  return (
    <Dialog
      onClose={handleDialogClose}
      open={open}
      maxWidth="sm"
      fullWidth
      title="랜딩페이지 URL 등록"
      buttons={
        <div style={{ display: 'flex' }}>
          <Button
            color="primary"
            disabled={
              // from https://regexr.com/3um70
              !landingUrlRegex.test(mainUrl.value) || !isLengthValid()
            }
            onClick={handleSubmit}
            variant="contained"
          >
            등록
          </Button>
          <Button variant="contained" onClick={handleDialogClose}>
            취소
          </Button>
        </div>
      }
    >
      <Stepper activeStep={activeStep} orientation="vertical" style={{ padding: 0 }}>
        <Step key="0">
          <StepLabel StepIconComponent={QontoStepIcon}>URL 등록</StepLabel>
          <StepContent>
            <UrlUploadStep
              mainUrlName={mainUrlName}
              mainUrl={mainUrl}
              subOpen={subOpen}
              subUrl={subUrl}
              subUrlName={subUrlName}
              subUrlCheck={subUrlCheck}
            />
          </StepContent>
        </Step>
      </Stepper>
    </Dialog>
  );
}
