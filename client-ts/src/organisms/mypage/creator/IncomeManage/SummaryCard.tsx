import * as React from 'react';
import { Chip, Grid, Paper, Typography } from '@material-ui/core';
import moment from 'moment';
import { Help } from '@material-ui/icons';
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
import { UseGetRequestObject } from '../../../../utils/hooks/useGetRequest';
import { IncomeCashRes } from '../Dashboard/UserInfoCard';
import { ProfileDataType } from '../Mypage/ProfileData.type';

export interface SummaryCardProps {
  descAnchor: boolean;
  descAnchorOpen: (event: React.MouseEvent<HTMLElement>) => void;
  profileData: UseGetRequestObject<ProfileDataType>;
  incomeCashGet: UseGetRequestObject<IncomeCashRes>;
}
export default function SummaryCard({
  descAnchor,
  descAnchorOpen,
  profileData,
  incomeCashGet,
}: SummaryCardProps): JSX.Element {
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

  return (
    <Paper style={{ padding: 32, height: 200, marginTop: 8 }}>
      {/* 로딩 */}
      {incomeCashGet.loading && <CenterLoading />}

      {!incomeCashGet.loading && incomeCashGet.data && (
        <div style={{ height: 'auto' }}>
          <Typography style={{ fontWeight: 'bold' }}>수익금 정보 및 정산 정보</Typography>
          <Grid container alignItems="center" style={{ marginTop: 32 }}>
            <Grid item xs={6} md={4}>
              {!profileData.loading && profileData.data && (
                <div>
                  <Typography>
                    정산 등록 여부
                    <Typography
                      aria-owns={descAnchor ? 'mouse-over-popover' : undefined}
                      component="span"
                      aria-haspopup="true"
                      style={{ cursor: 'pointer' }}
                      onClick={descAnchorOpen}
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
              <Typography style={{ fontWeight: 'bold' }} variant="h6">
                {`${incomeCashGet.data.creatorReceivable.toLocaleString()} 원`}
              </Typography>
            </Grid>
            <Grid item xs={6} md={4}>
              <Typography>누적 수익금</Typography>
              <Typography style={{ fontWeight: 'bold' }} variant="h6">
                {`${incomeCashGet.data.creatorTotalIncome.toLocaleString()} 원`}
              </Typography>
            </Grid>
          </Grid>
          <Typography color="textSecondary" variant="caption">
            {`최근 수익 반영: ${moment(incomeCashGet.data.date).fromNow()}`}
          </Typography>
        </div>
      )}
    </Paper>
  );
}
