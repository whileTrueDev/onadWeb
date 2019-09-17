import React from 'react';
import Typography from '@material-ui/core/Typography';
import GridContainer from '../../../components/Grid/GridContainer';
import GridItem from '../../../components/Grid/GridItem';
import UserDataForm from './UserManage/UserDataForm';
import RefundAccountForm from './CashManage/RefundAccountForm';
import MyCash from './CashManage/MyCash';
import CashHistoryTable from './CashManage/CashHistoryTable';
import BusinessRegistration from './MyTaskManage/BusinessRegistrationUploadForm';
import TaxBillRequestForm from './MyTaskManage/TaxBillRequestForm';
// hook for data fetching
import useFetchData from '../../../lib/hooks/useFetchData';

export default function MyOffice() {
  // 계좌 정보 데이터 조회
  const accountData = useFetchData('/api/dashboard/marketer/accountNumber');

  return (
    <div>
      <Typography variant="h5">광고캐시 관리</Typography>
      {/* 광고캐시 충전 및 환불, 관리 */}
      <GridContainer>
        <GridItem xs={12} sm={12} md={6} lg={5} xl={3}>
          <GridContainer>
            <GridItem xs={12}>
              <MyCash accountData={accountData} />
            </GridItem>
            <GridItem xs={12}>
              <RefundAccountForm accountData={accountData} />
            </GridItem>
          </GridContainer>
        </GridItem>
        <GridItem xs={12} sm={12} md={6} lg={7} xl={5}>
          <CashHistoryTable />

        </GridItem>
      </GridContainer>

      <Typography variant="h5">??????????</Typography>
      {/* 계정 관리 */}
      <GridContainer>

        <GridItem xs={12} sm={12} md={6} lg={5} xl={3}>
          <UserDataForm />
        </GridItem>
        <GridItem xs={12} sm={12} md={6} lg={5} xl={3}>
          <GridContainer>
            <GridItem xs={12}>
              <BusinessRegistration />
            </GridItem>
            <GridItem xs={12}>
              <TaxBillRequestForm />
            </GridItem>
          </GridContainer>
        </GridItem>


      </GridContainer>


    </div>
  );
}
