import React from 'react';
import Typography from '@material-ui/core/Typography';
import GridContainer from '../../atoms/Grid/GridContainer';
import GridItem from '../../atoms/Grid/GridItem';
import UserDataForm from '../../organisms/marketer/MyOffice/UserManage/UserDataForm';
import RefundAccountForm from '../../organisms/marketer/MyOffice/UserManage/RefundAccountForm';
import MyCash from '../../organisms/marketer/MyOffice/CashManage/MyCash';
import CashHistoryTable from '../../organisms/marketer/MyOffice/CashManage/CashHistoryTable';
import RefundHistoryTable from '../../organisms/marketer/MyOffice/CashManage/RefundHistoryTable';
import BusinessRegistration from '../../organisms/marketer/MyOffice/UserManage/BusinessRegistrationUploadForm';
// hook for data fetching
import useFetchData from '../../utils/lib/hooks/useFetchData';

export default function MyOffice() {
  // 계좌 정보
  const accountData = useFetchData('/api/dashboard/marketer/profile/accountNumber');
  // 마케터 유저타입이 사업체인 경우와 개인인 경우의 분기처리를 위해
  const userData = useFetchData('/api/dashboard/marketer/profile');
  // 사업자 등록증 정보
  const businessRegistrationData = useFetchData('/api/dashboard/marketer/profile/business');

  return (
    <div>

      <Typography variant="h5" style={{ marginTop: 35 }}>광고캐시 관리</Typography>
      {/* 광고캐시 충전 및 환불, 관리 */}
      <GridContainer>
        <GridItem xs={12} md={12} lg={8} xl={6}>
          <MyCash accountData={accountData} userData={userData} />
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={12} md={12} lg={8} xl={3}>
          <CashHistoryTable />
        </GridItem>
        <GridItem xs={12} sm={12} md={12} lg={8} xl={3}>
          <RefundHistoryTable />
        </GridItem>
      </GridContainer>


      <Typography variant="h5" style={{ marginTop: 35 }}>내정보관리</Typography>
      {/* 계정 관리 */}
      {!userData.loading && userData.payload && (
      <GridContainer>
        <GridItem xs={12} sm={12} md={8} lg={6} xl={3}>
          <UserDataForm userData={userData.payload} reCall={userData.callUrl} />
        </GridItem>

        <GridItem xs={12} lg={6} xl={3}>
          <GridContainer>
            {userData.payload.marketerUserType ? (
              <GridItem xs={12}>
                <BusinessRegistration businessRegistrationData={businessRegistrationData} />
              </GridItem>
            ) : (null)}
            <GridItem xs={12}>
              <RefundAccountForm accountData={accountData} />
            </GridItem>
          </GridContainer>
        </GridItem>

      </GridContainer>
      )}

    </div>
  );
}
