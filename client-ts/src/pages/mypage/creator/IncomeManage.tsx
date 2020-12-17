import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import WithdrawalCard from '../../../organisms/mypage/creator/IncomeManage/WithdrawalCard';
import SettlementCard from '../../../organisms/mypage/creator/IncomeManage/SettlementCard';
import useGetRequest from '../../../utils/hooks/useGetRequest';
import { IncomeCashRes } from '../../../organisms/mypage/creator/Dashboard/UserInfoCard';
import AdIncomeCard from '../../../organisms/mypage/creator/shared/AdIncomeCard';
import { useAnchorEl } from '../../../utils/hooks';
import SettlementDescPopover from '../../../organisms/mypage/creator/IncomeManage/SettlementDescPopover';
import SummaryCard from '../../../organisms/mypage/creator/IncomeManage/SummaryCard';
import { ProfileDataType } from '../../../organisms/mypage/creator/Mypage/ProfileData.type';


export default function IncomeManage(): JSX.Element {
  // 프로필 유저 데이터
  const profileData = useGetRequest<null, ProfileDataType>('/creator');
  // 수익금 정보 조회
  const incomeCashGet = useGetRequest<null, IncomeCashRes>('/creator/income');
  // 출금 내역 데이터
  const withdrawalData = useGetRequest('/creator/income/withdrawal');

  // 설명 anchor 
  const descAnchor = useAnchorEl();
  return (
    <div style={{ margin: '0 auto', maxWidth: 1430 }}>
      <GridContainer direction="row" spacing={1}>

        {/* 광고 수익 정보 */}
        <GridItem xs={12} lg={6}>
          <div style={{ marginTop: 8 }}>
            <AdIncomeCard />
          </div>
        </GridItem>

        {/* 수익금 정보 및 출금신청 */}
        <GridItem xs={12} lg={6}>
          <SummaryCard
            descAnchor={descAnchor.open}
            descAnchorOpen={descAnchor.handleAnchorOpen}
            profileData={profileData}
            incomeCashGet={incomeCashGet}
          />
        </GridItem>

        {/* 출금 신청 내역 */}
        <GridItem xs={12} lg={6}>
          {(profileData.loading || withdrawalData.loading) && (<Skeleton height={400} variant="rect" />)}
          {!(profileData.loading || withdrawalData.loading) && (
          <WithdrawalCard withdrawalData={withdrawalData.data ? withdrawalData.data : []} />
          )}
        </GridItem>

        {/* 정산 등록 */}
        <GridItem xs={12} lg={6}>
          {(profileData.loading || withdrawalData.loading) && (<Skeleton height={400} variant="text" />)}
          {!(profileData.loading || withdrawalData.loading) && profileData.data && (
          <SettlementCard profileData={profileData.data} />
          )}
        </GridItem>
      </GridContainer>

      {/* 정산등록이 무엇인지 알려주는 Popover */}
      <SettlementDescPopover
        open={descAnchor.open}
        anchorEl={descAnchor.anchorEl}
        onClose={descAnchor.handleAnchorClose}
      />
    </div>
  );
}
