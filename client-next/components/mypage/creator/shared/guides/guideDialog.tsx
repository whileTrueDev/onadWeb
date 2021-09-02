import { Typography, Button, Stepper, Step, StepLabel, makeStyles } from '@material-ui/core';
import React from 'react';
import { useRouter } from 'next/router';
import { useCreatorProfile } from '../../../../../utils/hooks/query/useCreatorProfile';
import ContractionSection from './contractionSection';
import GuideComplete from './guideComplete';
import GuideIntroduction from './guideIntroduction';
import SetClickAdSection from './setClickAdSection';
import SetOverlaySection from './setOverlaySection';
import SetSettlementSection from './setSettlementSection';
import CustomDialog from '../../../../../atoms/dialog/dialog';

const useStyles = makeStyles(theme => ({
  contents: { padding: theme.spacing(2) },
  actionsContainer: { textAlign: 'right' },
}));

interface GuideDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function GuideDialog({ open, onClose }: GuideDialogProps): React.ReactElement {
  const classes = useStyles();
  const profile = useCreatorProfile();
  const router = useRouter();
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
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };
  const handleBack = (): void => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };
  const handleStepReset = (): void => {
    setActiveStep(0);
  };
  // 각 단계 컴포넌트 목록
  const steps = [
    {
      label: '온애드 이용약관 동의하기',
      component: <ContractionSection />,
    },
    {
      label: '배너광고 준비하기',
      component: <SetOverlaySection />,
    },
    {
      label: '클릭광고 준비하기',
      component: <SetClickAdSection />,
    },
    { label: '광고 준비 완료!', component: <GuideComplete /> },
    { label: '수익금 출금하기', component: <SetSettlementSection /> },
  ];

  function getStepComponent(step: number): React.ReactNode {
    return steps[step].component;
  }

  return (
    <CustomDialog
      open={open}
      onClose={(): void => {
        onClose();
        handleIntroReset();
        handleStepReset();
      }}
      title="온애드 시작 가이드"
      maxWidth="md"
      fullWidth
    >
      {/* 연동된 플랫폼이 하나도 없는 경우 */}
      {!profile.data?.creatorTwitchOriginalId && !profile.data?.afreecaId ? (
        <div style={{ textAlign: 'center', padding: 32 }}>
          <Typography>죄송합니다. </Typography>
          <Typography>아직 연동된 방송 플랫폼이 없어 온애드를 시작할 수 없습니다.</Typography>
          <br />
          <Button
            color="primary"
            variant="contained"
            onClick={(): Promise<boolean> => router.push('/mypage/creator/user')}
          >
            플랫폼 연동하러가기
          </Button>
        </div>
      ) : (
        <div>
          {introduction ? (
            <GuideIntroduction />
          ) : (
            <>
              {/* 가이드 Stepper */}
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map(step => (
                  <Step key={step.label}>
                    <StepLabel color="textPrimary">{step.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {/* 단계별 컴포넌트 */}
              <div className={classes.contents}>{getStepComponent(activeStep)}</div>
            </>
          )}

          {/* Stepper 버튼 섹션 */}
          <div className={classes.actionsContainer}>
            <Button
              variant="contained"
              onClick={(): void => {
                if (activeStep === 0) {
                  onClose();
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
                  onClose();
                  handleStepReset();
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
    </CustomDialog>
  );
}
