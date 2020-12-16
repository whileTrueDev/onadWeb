import React from 'react';
import moment from 'moment';
import Skeleton from '@material-ui/lab/Skeleton';
import {
  Chip, CircularProgress, Grid, IconButton, makeStyles, Paper, Popover, Typography
} from '@material-ui/core';
import { Help } from '@material-ui/icons';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import WithdrawalCard from '../../../organisms/mypage/creator/IncomeManage/WithdrawalCard';
import SettlementCard from '../../../organisms/mypage/creator/IncomeManage/SettlementCard';
import useGetRequest from '../../../utils/hooks/useGetRequest';
import { IncomeCashRes } from '../../../organisms/mypage/creator/Dashboard/UserInfoCard';
import AdIncomeCard from '../../../organisms/mypage/creator/shared/AdIncomeCard';
import CenterLoading from '../../../atoms/Loading/CenterLoading';
import { useAnchorEl } from '../../../utils/hooks';

const useStyles = makeStyles((theme) => ({
  tooltip: { padding: theme.spacing(4), maxWidth: 300, textAlign: 'center' },
}));
export default function IncomeManage(): JSX.Element {
  const classes = useStyles();

  // 프로필 유저 데이터
  const profileData = useGetRequest('/creator');
  // 수익금 정보 조회
  const incomeCashGet = useGetRequest<null, IncomeCashRes>('/creator/income');
  // 출금 내역 데이터
  const withdrawalData = useGetRequest('/creator/income/withdrawal');

  function renderSettlementState(state: number): string {
    let settlementState;
    switch (state) {
      case 0:
        settlementState = '미등록';
        break;
      case 1:
        settlementState = '승인대기';
        break;
      case 2:
        settlementState = '승인완료';
        break;
      default:
        settlementState = '반려';
        break;
    }
    return settlementState;
  }

  // 설명 anchor 
  const descAnchor = useAnchorEl();
  return (
    <div style={{ margin: '0 auto', maxWidth: 1430 }}>
      <GridContainer direction="row" spacing={1}>

        {/* 수익금 정보 및 출금신청 */}
        <GridItem xs={12} lg={6}>
          <Paper style={{ padding: 32, height: 200, marginTop: 8 }}>
            <Typography style={{ fontWeight: 'bold' }}>수익금 정보 및 출금신청</Typography>
            {/* 로딩 */}
            {incomeCashGet.loading && (<CenterLoading />)}

            {!incomeCashGet.loading && incomeCashGet.data && (
              <div style={{ height: 'auto' }}>
                <Grid container alignItems="center" style={{ marginTop: 32, }}>
                  <Grid item xs={6} md={4}>
                    {!profileData.loading && profileData.data && (
                      <div>
                        <Typography>
                          정산 등록 여부
                          <Typography
                            aria-owns={descAnchor.open ? 'mouse-over-popover' : undefined}
                            component="span"
                            aria-haspopup="true"
                            style={{ cursor: 'pointer' }}
                            onClick={descAnchor.handleAnchorOpen}
                          >
                            <Help fontSize="small" />
                          </Typography>
                        </Typography>
                        <Chip
                          label={renderSettlementState(profileData.data.settlementState)}
                          color={profileData.data.settlementState === 2 ? 'primary' : 'default'}
                        />
                      </div>
                    )}
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Typography>출금 가능 수익금</Typography>
                    <Typography style={{ fontWeight: 'bold' }} variant="h6">{`${incomeCashGet.data.creatorReceivable.toLocaleString()} 원`}</Typography>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Typography>누적 수익금</Typography>
                    <Typography style={{ fontWeight: 'bold' }} variant="h6">{`${incomeCashGet.data.creatorTotalIncome.toLocaleString()} 원`}</Typography>
                  </Grid>

                </Grid>
                <Typography color="textSecondary" variant="caption">{`최근 수익 반영: ${moment(incomeCashGet.data.date).fromNow()}`}</Typography>
              </div>
            )}
          </Paper>
        </GridItem>

        {/* 광고 수익 정보 */}
        <GridItem xs={12} lg={6}>
          <div style={{ marginTop: 8 }}>
            <AdIncomeCard />
          </div>
        </GridItem>

        {/* 출금 신청 내역 */}
        <GridItem xs={12}>
          {(profileData.loading || withdrawalData.loading) && (<Skeleton height={400} variant="rect" />)}
          {!(profileData.loading || withdrawalData.loading) && (
          <WithdrawalCard withdrawalData={withdrawalData.data ? withdrawalData.data : []} />
          )}
        </GridItem>

        {/* 정산 등록 */}
        <GridItem xs={12}>
          {(profileData.loading || withdrawalData.loading) && (<Skeleton height={400} variant="text" />)}
          {!(profileData.loading || withdrawalData.loading) && profileData.data && (
          <SettlementCard profileData={profileData.data} />
          )}
        </GridItem>
      </GridContainer>

      {/* 정산등록이 무엇인지 알려주는 Popover */}
      <Popover
        disableScrollLock
        id="mouse-over-popover"
        open={descAnchor.open}
        anchorEl={descAnchor.anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={descAnchor.handleAnchorClose}
        disableRestoreFocus
      >
        <div className={classes.tooltip}>
          <Typography variant="body2" color="primary">
            정산 등록은
          </Typography>
          <Typography variant="body2">
            수익금 출금을 위해서 꼭 필요한 절차로,
          </Typography>
          <Typography variant="body2">
            몇 가지 세금처리 관련 정보를
          </Typography>
          <Typography variant="body2">
            온애드에 제출하는 절차입니다.
          </Typography>
        </div>
      </Popover>
    </div>
  );
}
