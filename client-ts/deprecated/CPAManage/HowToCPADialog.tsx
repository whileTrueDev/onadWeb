import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Stepper, Step, StepLabel } from '@material-ui/core';
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

const useStyles = makeStyles(theme => ({
  container: { marginTop: theme.spacing(4) },
  adpageUrl: { color: theme.palette.primary.main, fontWeight: 800, cursor: 'default' },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '48px 0px',
  },
}));

interface CPAIncomeTableProps {
  open: boolean;
  handleClose: () => void;
  CPAmainData: AdPickMetrics;
}
export default function CPAIncomeTable({
  open,
  handleClose,
  CPAmainData,
}: CPAIncomeTableProps): JSX.Element {
  const classes = useStyles();
  const getAdpageLink = (): string => `${ADPAGE_HOST}/${CPAmainData.creatorTwitchId}`;

  // Stepper
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { icon: Filter1Icon, shortTitle: '패널 등록', title: '트위치 패널에 배너 등록하기' },
    { icon: Filter2Icon, shortTitle: '광고 등록', title: '광고페이지에 참여형 광고 등록하기' },
    { icon: Filter3Icon, shortTitle: '수익 발생', title: '시청자 참여시 수익 발생' },
  ];
  function handleJumpTo(idx: number): void {
    setActiveStep(idx);
  }
  function handleNext(): void {
    if (activeStep === steps.length - 1) {
      handleClose();
      setActiveStep(0);
    } else {
      setActiveStep(activeStep + 1);
    }
  }
  function handlePrevious(): void {
    if (activeStep === 0) {
      handleClose();
      setActiveStep(0);
    } else {
      setActiveStep(activeStep - 1);
    }
  }

  const getContents = (step: number): JSX.Element | undefined => {
    switch (step) {
      case 0:
        return (
          <GridItem container direction="column" alignItems="center" className={classes.container}>
            <img src="/pngs/cpa/참여형패널설정.png" alt="" style={{ maxWidth: '100%' }} />

            <br />
            <Typography variant="body2">
              * 기존 클릭광고용 패널과는 별도이며, 추가적인 등록이 필요합니다.
            </Typography>
            <br />
            <Typography variant="body2">
              * 이미지 링크는 다음의 광고페이지 URL로 등록해주세요.
            </Typography>
            <Typography variant="body2" className={classes.adpageUrl}>
              {getAdpageLink()}
            </Typography>
            <br />
            <Typography variant="body2">* 트위치 패널 등록용 이미지는 다음과 같습니다.</Typography>
            <Typography variant="body2">개인 이미지를 사용하셔도 무방합니다.</Typography>
            <Typography variant="body2">이미지 클릭시 다운로드됩니다.</Typography>
            <br />
            <a download="온애드참여형광고배너1.png" href="/pngs/cpa/온애드참여형광고배너1.png">
              <img src="/pngs/cpa/온애드참여형광고배너1.png" alt="" width="100%" />
            </a>
            <a download="온애드참여형광고배너2.png" href="/pngs/cpa/온애드참여형광고배너2.png">
              <img src="/pngs/cpa/온애드참여형광고배너2.png" alt="" width="100%" />
            </a>
            <a download="온애드참여형광고배너3.png" href="/pngs/cpa/온애드참여형광고배너3.png">
              <img src="/pngs/cpa/온애드참여형광고배너3.png" alt="" width="100%" />
            </a>
          </GridItem>
        );
      case 1:
        return (
          <GridItem container direction="column" alignItems="center" className={classes.container}>
            <img
              src="/pngs/dashboard/manual/new_creator/creator-adpage-05.png"
              alt=""
              style={{ maxWidth: '100%' }}
            />

            <br />
            <Typography variant="body2">
              * 자신의 광고페이지에 업로드할 광고를 선택하여 등록합니다.
            </Typography>
            <Typography variant="body2">
              * 많은 광고를 등록할수록 수익 창출에 유리합니다. 등록할 수 있는 광고 수의 제한은
              없습니다.
            </Typography>
            <Typography variant="body2">
              * 등록한 광고를 제외할 수 있습니다. 제외한 광고는 다시 등록할 수 있습니다.
            </Typography>
            <Typography variant="body2">
              * 모든 광고는 광고주의 요청 및 한도 도달 등의 이유로 자동으로 종료될 수 있습니다.
            </Typography>
            <br />
          </GridItem>
        );
      case 2:
        return (
          <GridItem container direction="column" alignItems="center" className={classes.container}>
            <img src="/pngs/cpa/광고페이지시청자참여.png" alt="" style={{ maxWidth: '100%' }} />

            <br />
            <Typography variant="body2" className={classes.adpageUrl}>
              {getAdpageLink()}
            </Typography>
            <Typography variant="body2">
              * 내 광고페이지에서 등록된 광고를 확인할 수 있습니다.
            </Typography>
            <Typography variant="body2">
              * 시청자가 각 광고에서 요구하는 행동 진행 시 수익이 창출됩니다.
            </Typography>
            <Typography variant="body2">
              * 시청자 유입을 유도할수록 수익 창출에 유리합니다.
            </Typography>
            <Typography variant="body2">
              * 모든 광고는 1인 1회의 참여만 수익에 반영됩니다.
            </Typography>
            <Typography variant="body2">
              * 시청자의 참여가 수익으로 반영되기까지 최대 1일의 시간이 소요될 수 있습니다.
            </Typography>
            <br />
          </GridItem>
        );
      default:
        return undefined;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="참여형 광고 시작하기"
      fullWidth
      maxWidth="md"
      buttons={
        <div>
          <TransparentButton onClick={handlePrevious}>이전</TransparentButton>
          <Button color="primary" onClick={handleNext}>
            다음
          </Button>
        </div>
      }
    >
      <GridContainer>
        <GridItem xs={12}>
          {/* Stepper */}
          <Stepper alternativeLabel activeStep={activeStep}>
            {steps.map((step, stepIdx) => (
              <Step key={step.title}>
                <StepLabel
                  onClick={(): void => {
                    handleJumpTo(stepIdx);
                  }}
                  style={{ cursor: 'pointer' }}
                  StepIconComponent={(): JSX.Element => (
                    <step.icon color={stepIdx <= activeStep ? 'primary' : 'inherit'} />
                  )}
                >
                  <Typography style={{ fontWeight: 800 }}>{step.shortTitle}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* 제목 */}
          <div className={classes.title}>
            <Typography style={{ fontWeight: 800 }} variant="h6">
              {steps[activeStep].title}
            </Typography>
          </div>
          {/* Contents */}
          {getContents(activeStep)}
        </GridItem>
      </GridContainer>
    </Dialog>
  );
}
