import * as React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Chip, Grid, Paper, Typography } from '@material-ui/core';
import { Help } from '@material-ui/icons';
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
import { UseGetRequestObject } from '../../../../utils/hooks/useGetRequest';
import { IncomeCashRes } from '../Dashboard/UserInfoCard';
import { useCreatorProfile } from '../../../../utils/hooks/query/useCreatorProfile';

dayjs.extend(relativeTime);
export interface SummaryCardProps {
  descAnchor: boolean;
  descAnchorOpen: (event: React.MouseEvent<HTMLElement>) => void;
  incomeCashGet: UseGetRequestObject<IncomeCashRes>;
}
export default function SummaryCard({
  descAnchor,
  descAnchorOpen,
  incomeCashGet,
}: SummaryCardProps): JSX.Element {
  const creatorProfile = useCreatorProfile();
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
              {!creatorProfile.isLoading && creatorProfile.data && (
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
                    label={renderSettlementState(creatorProfile.data.settlementState)}
                    color={creatorProfile.data.settlementState === 2 ? 'primary' : 'default'}
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
            {`최근 수익 반영: ${dayjs(incomeCashGet.data.date).fromNow()}`}
          </Typography>
        </div>
      )}
    </Paper>
  );
}
