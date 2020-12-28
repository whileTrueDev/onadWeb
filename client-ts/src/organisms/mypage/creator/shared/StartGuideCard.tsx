import React, { useEffect } from 'react';
import {
  Paper, Typography, Stepper, Step, StepLabel, makeStyles, Button
} from '@material-ui/core';
// components
import Dialog from '../../../../atoms/Dialog/Dialog';
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
import StyledTooltip from '../../../../atoms/Tooltip/StyledTooltip';
import history from '../../../../history';
import GuideComplete from './guides/GuideComplete';

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
        contractionData={contractionData}
        handleSnackOpen={handleSnackOpen}
      />,
    },
    { label: '광고 준비 완료!', component: <GuideComplete /> },
    { label: '수익금 출금하기', component: <SetSettlementSection />, },
  ];

  function getStepComponent(step: number): React.ReactNode {
    return steps[step].component;
  }

  // 첫 사용자 도움 popper 
  const tooltip = useDialog();
  useEffect(() => {
    if (!contractionData.creatorContractionAgreement) {
      tooltip.handleOpen();
    }
  }, [tooltip, contractionData]);

  return (
    <>
      <Paper className={classes.container}>
        <Typography className={classes.bold}>
          <span className={classes.red}>[필수]</span>
          &nbsp;
          온애드 시작 가이드
        </Typography>

        {/* 계약 완료 버튼 */}
        <StyledTooltip
          title={<Typography variant="body2">시작가이드와 함께 시작해보세요</Typography>}
          placement="bottom-start"
          open={!guideDialog.open && tooltip.open}
          arrow
          interactive
        >
          <div>
            <Button
              color="primary"
              variant="contained"
              onClick={guideDialog.handleOpen}
            >
              시작하기
            </Button>
          </div>
        </StyledTooltip>

      </Paper>

      <Dialog
        open={guideDialog.open}
        onClose={(): void => {
          guideDialog.handleClose();
          handleIntroReset();
          handleStepReset();
        }}
        title="온애드 시작 가이드"
        maxWidth="md"
        fullWidth
      >
        {/* 연동된 플랫폼이 하나도 없는 경우 */}
        {!contractionData.creatorTwitchOriginalId && !contractionData.afreecaId ? (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <Typography>죄송합니다. </Typography>
            <Typography>아직 연동된 방송 플랫폼이 없어 온애드를 시작할 수 없습니다.</Typography>
            <Button
              color="primary"
              variant="contained"
              onClick={(): void => history.push('/mypage/creator/user')}
            >
              플랫폼 연동하러가기

            </Button>
          </div>
        ) : (
          <div>
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
                variant="contained"
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
                variant="contained"
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
          </div>
        )}
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
