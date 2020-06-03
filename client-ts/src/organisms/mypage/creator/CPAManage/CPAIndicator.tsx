import React from 'react';
import { useTheme } from '@material-ui/core/styles';
// components
import {
  Grid, Typography,
} from '@material-ui/core';
import CustomCard from '../../../../atoms/CustomCard';
import StyledItemText from '../../../../atoms/StyledItemText';
import Button from '../../../../atoms/CustomButtons/Button';
// hook
import { ADPAGE_HOST } from '../../../../config';
// type
import { AdPickMetrics } from './AdpickTypes';
// style
import useStyle from './CPAAgreement.style';

interface CPAIndicatorProps {
  CPAmainData: AdPickMetrics;
  callback: () => void;
  handleIncomeTableDialogOpen: () => void;
  handleAgreementDialogOpen: () => void;
  handleHowToCPADialogOpen: () => void;
}
export default function CPAIndicator({
  CPAmainData,
  handleIncomeTableDialogOpen,
  handleAgreementDialogOpen,
  handleHowToCPADialogOpen
}: CPAIndicatorProps): JSX.Element {
  const classes = useStyle();
  const theme = useTheme();

  const getAdpageLink = (): string => `${ADPAGE_HOST}/${CPAmainData.creatorTwitchId}`;
  function handleAdpageOpen(): void {
    const newTap = window.open(getAdpageLink(), '_blank');
    if (newTap) {
      newTap.focus();
    }
  }

  return (
    <CustomCard iconComponent={<StyledItemText primary="나의 참여형 광고" color="white" />} backgroundColor>
      <Grid container direction="row" className={classes.stepExplain} justify="center">
        <Grid item xs={12} lg={4} className={classes.box}>
          <Typography
            variant="body1"
            align="center"
            onClick={handleAdpageOpen}
            color="primary"
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            {getAdpageLink()}
          </Typography>
          <Typography variant="body1" align="center" component="div">
            참여형 광고 수익금 :
            {' '}
            <span style={{ color: theme.palette.primary.main, fontWeight: 800 }}>
              {CPAmainData.totalCPAIncome}
            </span>
            {' '}
            원
          </Typography>
          <Typography variant="body1" align="center" component="div">
            수익 발생 광고 수 :
            {' '}
            <span style={{ color: theme.palette.primary.main, fontWeight: 800 }}>
              {CPAmainData.totalCPACount}
            </span>
            {' '}
            건
          </Typography>
        </Grid>
        <Grid item className={classes.box} xs={12} md={8} sm={8}>
          <div className={classes.buttonWrap}>
            <Button
              color="secondary"
              onClick={handleHowToCPADialogOpen}
              style={{ color: 'white' }}
            >
              광고 시작하기
            </Button>
            <Button
              color="primary"
              onClick={handleIncomeTableDialogOpen}
            >
              수익내역 확인
            </Button>
            <Button
              color="primary"
              onClick={handleAgreementDialogOpen}
            >
              유의사항 확인
            </Button>
          </div>
          <Typography variant="body1" align="center" gutterBottom className={classes.stepWrapRed}>
            * 참여형 광고로 인한 실적(수익금, 운영수, 상세내역) 반영에는 1~2일이 소요됩니다
          </Typography>
          <Typography variant="body1" align="center" gutterBottom className={classes.stepWrapRed}>
            * 모든 참여형 광고 캠페인은 광고주의 진행/중단 요청에 따라 임의로 종료될 수 있습니다
          </Typography>
        </Grid>
      </Grid>
    </CustomCard>
  );
}
