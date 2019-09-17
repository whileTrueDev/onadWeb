import React from 'react';
import Typography from '@material-ui/core/Typography';
import GridContainer from '../../../components/Grid/GridContainer';
import GridItem from '../../../components/Grid/GridItem';
import UserDataForm from './UserManage/UserDataForm';
import RefundAccountForm from './CashManage/RefundAccountForm';
import CashHistory from './CashManage/CashHistory';
import CashHistoryTable from './CashManage/CashHistoryTable';
import BusinessRegistration from './MyTaskManage/BusinessRegistrationUploadForm';
import TaxBillRequestForm from './MyTaskManage/TaxBillRequestForm';

export default function MyOffice(props) {
  return (
    <div>
      <Typography variant="h5">광고캐시 관리</Typography>
      {/* 광고캐시 충전 및 환불, 관리 */}
      <GridContainer>
        <GridItem xs={12} sm={12} md={6} lg={5} xl={3}>
          <GridContainer>
            <GridItem xs={12}>
              <CashHistory />
            </GridItem>
            <GridItem xs={12}>
              <RefundAccountForm />
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
