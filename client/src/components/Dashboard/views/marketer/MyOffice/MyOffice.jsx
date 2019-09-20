import React from 'react';
import Typography from '@material-ui/core/Typography';
import GridContainer from '../../../components/Grid/GridContainer';
import GridItem from '../../../components/Grid/GridItem';
import UserDataForm from './UserManage/UserDataForm';
import RefundAccountForm from './CashManage/RefundAccountForm';
import MyCash from './CashManage/MyCash';
import CashHistoryTable from './CashManage/CashHistoryTable';
import RefundHistoryTable from './CashManage/RefundHistoryTable';
import BusinessRegistration from './MyTaskManage/BusinessRegistrationUploadForm';
import TaxBillRequestForm from './MyTaskManage/TaxBillRequestForm';
// hook for data fetching
import useFetchData from '../../../lib/hooks/useFetchData';

export default function MyOffice() {
  // 계좌 정보
  const accountData = useFetchData('/api/dashboard/marketer/profile/accountNumber');
  // 마케터 유저타입이 사업체인 경우와 개인인 경우의 분기처리를 위해
  const userData = useFetchData('/api/dashboard/marketer/profile');
  // 사업자 등록증 정보
  const businessRegistrationData = useFetchData('/api/dashboard/marketer/profile/business');

  return (
    <div>
      {/* {!userData.loading && !userData.error && userData.payload.marketerUserType === 1 ? ( */}
      <div>
        <Typography variant="h5">업무 관리</Typography>
        {/* 업무 관리 */}
        <GridContainer>
          <GridItem xs={12} lg={8} xl={6}>
            <GridContainer>
              <GridItem xs={12} md={6}>
                <BusinessRegistration businessRegistrationData={businessRegistrationData} />
              </GridItem>
              <GridItem xs={12} md={6}>
                <TaxBillRequestForm
                  businessRegistrationData={businessRegistrationData}
                  userData={userData}
                />
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </div>
      {/* ) : (null)} */}


      <Typography variant="h5" style={{ marginTop: 35 }}>광고캐시 관리</Typography>
      {/* 광고캐시 충전 및 환불, 관리 */}
      <GridContainer>
        <GridItem xs={12} lg={8} xl={6}>
          <GridContainer>
            <GridItem xs={12} md={6}>
              <MyCash accountData={accountData} />
            </GridItem>
            <GridItem xs={12} md={6}>
              <RefundAccountForm accountData={accountData} />
            </GridItem>
          </GridContainer>
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
      <GridContainer>

        <GridItem xs={12} sm={12} md={8} lg={6} xl={3}>
          {!userData.loading && userData.payload && (
            <UserDataForm userData={userData.payload} reCall={userData.callUrl} />
          )}
        </GridItem>

      </GridContainer>

    </div>
  );
}
