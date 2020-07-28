import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
/*
  BusinessSelectStep 1 : 유형 선택, 사업자 등록증 업로드 or 현금 영수증 업로드
  BusinessUploadStep 2 : 선택된 유형에 대해 업로드 수행
  BusinessCompleteStep 3 : 업로드 완료 , 선택한 유형에 따라 세금 계산서 발행/현금 영수증 발행 안내
*/
import BusinessSelectStep from './BusinessSelectStep';
import BusinessUploadStep from './BusinessUploadStep';
import BusinessCompleteStep from './BusinessCompleteStep';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

interface BusinessRegiUploadDialogProps {
  open: boolean;
  handleClose: () => void;
  businessRegiImage: string;
  request: () => void;
  handleSnackOpen: () => void;
  step: {currStep: number; isBusiness: boolean};
}

// stepper 의 스탭 이름 정의
function getSteps(): string[] {
  return ['유형 선택', '필수 정보 업로드', '완료'];
}

export default function BuisnessUploadStepManager(
  props: BusinessRegiUploadDialogProps
): JSX.Element {
  const {
    handleClose, businessRegiImage, request, step
  } = props;
  const steps = getSteps();
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(step.currStep);
  const [isBusiness, setIsBusiness] = React.useState(step.isBusiness);

  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = (): void => {
    setActiveStep(0);
  };

  const handleChangeStep = (index: number): void => {
    setActiveStep(index);
  };

  const handleIsBusiness = (step2Index: boolean): void => {
    setIsBusiness(step2Index);
  };

  function getStepContent(stepIndex: number): JSX.Element {
    switch (stepIndex) {
      case 0:
        return <BusinessSelectStep handleChangeStep={handleChangeStep} handleIsBusiness={handleIsBusiness} />;
      case 1:
        return (
          <BusinessUploadStep
            handleClose={handleClose}
            handleChangeStep={handleChangeStep}
            isBusiness={isBusiness}
            businessRegiImage={businessRegiImage}
            request={request}
          />
        );
      case 2:
        return (
          <BusinessCompleteStep
            handleChangeStep={handleChangeStep}
            isBusiness={isBusiness}
          />
        );
      default:
        return <Typography variant="body1">진행에 문제가 발생했습니다. 창을 닫고 다시 처음부터 실행해 주세요</Typography>;
    }
  }
  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <span>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>All steps completed</Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            <Typography component="span" className={classes.instructions}>{getStepContent(activeStep)}</Typography>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              className={classes.backButton}
            >
                이전으로
            </Button>
            {activeStep === 2 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={(): void => {
                  handleClose();
                  window.location.reload();
                }}
              >
                완료
              </Button>
            ) : (<span />)}
          </div>
        )}
      </span>
    </div>
  );
}
