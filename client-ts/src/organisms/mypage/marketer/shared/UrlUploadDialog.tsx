import React, { useState } from 'react';
import { makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import {
  Grid, InputLabel, Input, FormHelperText,
  Collapse,
  Stepper, Step, StepLabel, StepContent,
  FormControl
} from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import classnames from 'classnames';

import Dialog from '../../../../atoms/Dialog/Dialog';
import Button from '../../../../atoms/CustomButtons/Button';
import useToggle from '../../../../utils/hooks/useToggle';
import useEventTargetValue from '../../../../utils/hooks/useEventTargetValue';
import usePostRequest from '../../../../utils/hooks/usePostRequest';
import UrlUploadStep from './UrlUploadStep';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  input: {
    fontSize: '14px',
    fontWeight: 700,
    color: theme.palette.text.primary,
    margin: '4px'
  },
  label: {
    fontSize: '20px',
    fontWeight: 700,
    color: theme.palette.primary.main,
    marginBottom: '7px',
  },
  checkbox: {

  },
  buttonSet: {
    maginTop: '16px'
  },
}));

const CssFormControl = withStyles((theme: Theme) => ({
  root: {
    '& label.Mui-focused': {
      color: theme.palette.primary.main,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
}))(FormControl);

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
interface UrlUploadDialogProps {
  open: boolean;
  handleClose: () => void;
  recallRequest?: () => void;

}

function QontoStepIcon(props: any): JSX.Element {
  const classes2 = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={classnames(classes2.root, { [classes2.active]: active })}
    >
      {completed ? <Check className={classes2.completed} /> : <div className={classes2.circle} />}
    </div>
  );
}

export default function UrlUploadDialog(props: UrlUploadDialogProps): JSX.Element {
  const classes = useStyles();
  const { open, handleClose, recallRequest } = props;
  const [activeStep, setStep] = useState(0);

  const subOpen = useToggle(); // Toggle for sub-urls
  const mainUrl = useEventTargetValue('https://'); // Main url
  const mainUrlName = useEventTargetValue(); // Main url name

  const subUrl = useEventTargetValue('https://'); // Sub url
  const subUrlName = useEventTargetValue(); // sub url name
  const subUrlCheck = useToggle(true); // Sub url2 설정/미설정

  const sub2Url = useEventTargetValue('https://'); // Sub url2
  const sub2UrlName = useEventTargetValue(); // Sub url2 name
  const sub2UrlCheck = useToggle(true); // Sub url2 설정/미설정

  const linkDesc = useEventTargetValue();
  const { doPostRequest } = usePostRequest<{
    links: {
      primary: boolean;
      linkName: string;
      linkTo: string;
    }[];
    linkDescription: string;
  }, any[]>(
    '/marketer/landing-url',
    // success callback function
    () => {
      handleClose();
      if (recallRequest) {
        recallRequest();
      }
    }
  );

  function handleSubmit(): void {
    const linkResult = [];
    linkResult.push({
      primary: true, linkName: mainUrlName.value, linkTo: mainUrl.value
    });
    if (!subUrlCheck.toggle) {
      linkResult.push({ primary: false, linkName: subUrlName.value, linkTo: subUrl.value });
    }
    if (!sub2UrlCheck.toggle) {
      linkResult.push({ primary: false, linkName: sub2UrlName.value, linkTo: sub2Url.value });
    }

    doPostRequest({ links: linkResult, linkDescription: linkDesc.value });
  }

  const handleNext = (number: number) => (): void => {
    setStep(number);
  };
  const handleReset = (): void => {
    setStep(0);
    handleClose();
  };
  return (
    <Dialog
      onClose={handleReset}
      open={open}
      maxWidth="sm"
      fullWidth
      title="랜딩페이지 URL 등록"
      buttons={
        activeStep === 0 ? (
          <div style={{ display: 'flex' }}>

            <Collapse
              in={(/^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/
                .test(mainUrl.value))}
            >
              <Button
                color="primary"
                disabled={// from https://regexr.com/3um70
                  !(/^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/
                    .test(mainUrl.value))
                }
                onClick={handleNext(1)}
              >
                다음
              </Button>
            </Collapse>
            <Button onClick={handleClose}>취소</Button>
          </div>
        )
          : (
            <div style={{ display: 'flex' }}>
              <Button
                color="primary"
                onClick={handleSubmit}
              >
                등록
              </Button>
              <Button onClick={handleReset}>취소</Button>
            </div>
          )
      }
    >
      <Stepper activeStep={activeStep} orientation="vertical" style={{ padding: 0 }}>
        <Step key="0">
          <StepLabel StepIconComponent={QontoStepIcon}>
            URL 등록
          </StepLabel>
          <StepContent>
            <UrlUploadStep
              mainUrlName={mainUrlName}
              mainUrl={mainUrl}
              subOpen={subOpen}
              subUrl={subUrl}
              subUrlName={subUrlName}
              subUrlCheck={subUrlCheck}
              handleClose={handleReset}
              handleNext={handleNext}
            />
          </StepContent>
        </Step>
        <Step key="1">
          <StepLabel StepIconComponent={QontoStepIcon}>
            홍보문구 입력
          </StepLabel>
          <StepContent>
            <Grid item>
              <CssFormControl
                required
                fullWidth
              >
                <InputLabel shrink htmlFor="company" className={classes.label}>홍보문구 입력</InputLabel>
                <Input
                  required
                  id="banner"
                  multiline
                  className={classes.input}
                  value={linkDesc.value}
                  onChange={linkDesc.handleChange}
                />
                <FormHelperText>
                  {' '}
                  {'챗봇 사용 시 보일 홍보문구를 입력해주세요. < 이벤트 / 할인정보 등>'}
                  {' '}
                </FormHelperText>
              </CssFormControl>
            </Grid>
          </StepContent>
        </Step>
      </Stepper>
    </Dialog>
  );
}
