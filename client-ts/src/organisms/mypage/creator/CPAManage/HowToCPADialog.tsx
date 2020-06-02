import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import {
  Typography, Stepper, Step, StepLabel
} from '@material-ui/core';
import TransparentButton from '@material-ui/core/Button';
// icons
import Filter1Icon from '@material-ui/icons/Filter1';
import Filter2Icon from '@material-ui/icons/Filter2';
import Filter3Icon from '@material-ui/icons/Filter3';
// atoms
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import Dialog from '../../../../atoms/Dialog/Dialog';
import Button from '../../../../atoms/CustomButtons/Button';
// types
import { AdPickMetrics } from './AdpickTypes';
import { ADPAGE_HOST } from '../../../../config';

interface CPAIncomeTableProps {
  open: boolean;
  handleClose: () => void;
  CPAmainData: AdPickMetrics;
}
export default function CPAIncomeTable({
  open,
  handleClose,
  CPAmainData
}: CPAIncomeTableProps): JSX.Element {
  const theme = useTheme();
  const getAdpageLink = (): string => `${ADPAGE_HOST}/${CPAmainData.creatorTwitchId}`;

  // Stepper
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = [
    { icon: Filter1Icon, title: '트위치 패널에 등록하기' },
    { icon: Filter2Icon, title: '광고페이지에 참여형 광고 등록하기' },
    { icon: Filter3Icon, title: '시청자 참여시 수익 발생' },
  ];

  const getContents = (step: number): JSX.Element | undefined => {
    switch (step) {
      case 0: return (
        <GridItem container direction="column" alignItems="center" style={{ marginTop: 32 }}>
          <img src="/pngs/cpa/참여형패널설정.png" alt="" style={{ maxWidth: 700 }} />

          <br />
          <Typography variant="body2">* 기존 클릭광고용 패널과는 별도이며, 추가적인 등록이 필요합니다.</Typography>
          <br />
          <Typography variant="body2">* 이미지 링크는 다음 URL로 등록해주세요</Typography>
          <Typography
            variant="body2"
            style={{ color: theme.palette.primary.main, fontWeight: 800, cursor: 'default' }}
          >
            {getAdpageLink()}
          </Typography>
          <br />
          <Typography variant="body2">* 패널 링크 등록용 이미지는 다음과 같습니다.</Typography>
          <Typography variant="body2">개인 이미지를 사용하셔도 무방합니다.</Typography>
          <Typography variant="body2">이미지 클릭시 다운로드됩니다.</Typography>
          <br />
          <a download="온애드참여형광고배너1.png" href="/pngs/cpa/온애드참여형광고배너1.png">
            <img src="/pngs/cpa/온애드참여형광고배너1.png" alt="" />
          </a>
          <a download="온애드참여형광고배너2.png" href="/pngs/cpa/온애드참여형광고배너2.png">
            <img src="/pngs/cpa/온애드참여형광고배너2.png" alt="" />
          </a>
          <a download="온애드참여형광고배너3.png" href="/pngs/cpa/온애드참여형광고배너3.png">
            <img src="/pngs/cpa/온애드참여형광고배너3.png" alt="" />
          </a>
        </GridItem>
      );
      case 1: return (
        <GridItem container direction="column" alignItems="center" style={{ marginTop: 32 }}>
          <img src="/pngs/dashboard/manual/new_creator/creator-adpage-05.png" alt="" style={{ maxWidth: 500 }} />

          <br />
          <Typography variant="body2">* 자신의 광고페이지에 업로드할 광고를 선택하여 등록합니다.</Typography>
          <Typography variant="body2">* 많은 광고를 등록할수록 수익 창출에 유리합니다. 등록할 수 있는 광고 수의 제한은 없습니다.</Typography>
          <Typography variant="body2">* 등록한 광고를 제외할 수 있습니다. 제외한 광고는 다시 등록할 수 있습니다.</Typography>
          <Typography variant="body2">* 모든 광고는 광고주의 요청 및 한도 도달 등의 이유로 자동으로 종료될 수 있습니다.</Typography>
          <br />

        </GridItem>
      );
      default: return undefined;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="참여형 광고 시작하기"
      fullWidth
      maxWidth="md"
      buttons={(
        <div>
          <TransparentButton onClick={() => {
            if (activeStep === 0) {
              handleClose();
              setActiveStep(0);
            } else {
              setActiveStep(activeStep - 1);
            }
          }}
          >
            이전
          </TransparentButton>
          <Button
            color="primary"
            onClick={() => {
              if (activeStep === steps.length) {
                handleClose();
              } else {
                setActiveStep(activeStep + 1);
              }
            }}
          >
            다음
          </Button>
        </div>
      )}
    >
      <GridContainer>
        <GridItem xs={12}>
          {/* Stepper */}
          <Stepper alternativeLabel activeStep={activeStep}>
            {steps.map((step, stepIdx) => (
              <Step key={step.title}>
                <StepLabel
                  onClick={() => { setActiveStep(stepIdx); }}
                  style={{ cursor: 'pointer' }}
                  StepIconComponent={(): JSX.Element => (
                    <step.icon color={stepIdx <= activeStep ? 'primary' : 'inherit'} />
                  )}
                >
                  <Typography style={{ fontWeight: 800 }}>
                    {step.title}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Contents */}
          {activeStep === steps.length ? (
            <div>DONE!</div>
          ) : (
            <>
              {getContents(activeStep)}
            </>
          )}
        </GridItem>
      </GridContainer>
    </Dialog>
  );
}
