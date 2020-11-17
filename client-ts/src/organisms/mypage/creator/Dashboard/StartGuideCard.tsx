import React from 'react';
import {
  Paper, Typography, Stepper, Step, StepLabel, makeStyles
} from '@material-ui/core';
// components
import Dialog from '../../../../atoms/Dialog/Dialog';
import Button from '../../../../atoms/CustomButtons/Button';
import Snackbar from '../../../../atoms/Snackbar/Snackbar';
// utils
import useDialog from '../../../../utils/hooks/useDialog';
import ContractionSection from './guides/ContractionSection';
import SetOverlaySection from './guides/SetOverlaySection';
import SetSettlementSection from './guides/SetSettlementSection';
import GuideIntroduction from './guides/GuideIntroduction';
import SetClickAdSection from './guides/SetClickAdSection';
import { OverlayUrlRes } from './OverlayUrlCard';
import { ContractionDataType } from '../../../../pages/mypage/creator/CPAManage';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  bold: { fontWeight: 'bold' },
  red: { color: theme.palette.error.main },
  contents: { padding: theme.spacing(2) },
  actionsContainer: { textAlign: 'right', },
}));

interface ContractionCardProps {
  doContractionDataRequest: () => void;
  contractionData: ContractionDataType;
  overlayUrlData: OverlayUrlRes;
  handleSnackOpen: () => void;
}
const ContractionCard = ({
  doContractionDataRequest,
  contractionData,
  overlayUrlData,
  handleSnackOpen,
}: ContractionCardProps): JSX.Element => {
  const classes = useStyles();

  const guideDialog = useDialog(); // 가이드 진행을 위해
  const snack = useDialog(); // 계약완료 스낵바를 위해

  // ********************************
  // 온애드 시작 가이드 소개 렌더링 여부
  const [introduction, setIntroduction] = React.useState(true);
  const handleIntroSkip = (): void => {
    setIntroduction(false);
  };
  const handleIntroReset = (): void => {
    setIntroduction(true);
  };
  // ********************************
  // 가이드 Stepper
  const [activeStep, setActiveStep] = React.useState(0);
  const handleNext = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleStepReset = (): void => {
    setActiveStep(0);
  };

  // 각 단계 컴포넌트 목록
  const steps = [
    {
      label: '온애드 이용약관 동의하기',
      component: <ContractionSection
        contractionData={contractionData}
        doContractionDataRequest={doContractionDataRequest}
        handleSuccess={(): void => { snack.handleOpen(); }}
      />,
    },
    {
      label: '배너광고 준비하기',
      component: <SetOverlaySection
        overlayUrlData={overlayUrlData}
        handleSnackOpen={handleSnackOpen}
      />,
    },
    {
      label: '클릭광고 준비하기',
      component: <SetClickAdSection
        handleSnackOpen={handleSnackOpen}
      />,
    },
    { label: '출금 정산 등록하기', component: <SetSettlementSection />, },
  ];

  function getStepComponent(step: number): React.ReactNode {
    return steps[step].component;
  }

  return (
    <>
      <Paper className={classes.container}>
        <Typography className={classes.bold}>
          <span className={classes.red}>[필수]</span>
          &nbsp;
          온애드 시작 가이드
        </Typography>
        {/* 계약 완료 버튼 */}
        <Button size="small" color="primary" onClick={guideDialog.handleOpen}>
          시작하기
        </Button>
      </Paper>

      <Dialog
        open={guideDialog.open}
        onClose={guideDialog.handleClose}
        title="온애드 시작 가이드"
        maxWidth="md"
        fullWidth
      >
        {introduction ? (<GuideIntroduction />) : (
          <>
            {/* 가이드 Stepper */}
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((step) => (
                <Step key={step.label}>
                  <StepLabel color="textPrimary">{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {/* 단계별 컴포넌트 */}
            <div className={classes.contents}>
              {getStepComponent(activeStep)}
            </div>
          </>
        )}

        {/* Stepper 버튼 섹션 */}
        <div className={classes.actionsContainer}>
          <Button
            size="small"
            onClick={(): void => {
              if (activeStep === 0) {
                guideDialog.handleClose();
                handleIntroReset();
                handleStepReset();
              } else handleBack();
            }}
          >
            이전
          </Button>
          <Button
            size="small"
            color="primary"
            onClick={(): void => {
              if (introduction) handleIntroSkip();
              else if (activeStep === steps.length - 1) {
                guideDialog.handleClose(); handleStepReset();
              } else {
                handleNext();
              }
            }}
          >
            다음
          </Button>
        </div>
      </Dialog>

      <Snackbar
        color="success"
        message="성공적으로 계약이 완료되었습니다."
        open={snack.open}
        onClose={snack.handleClose}
      />
    </>
  );
};

export default ContractionCard;
