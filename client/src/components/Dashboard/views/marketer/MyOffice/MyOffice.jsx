import React from 'react';
import Typography from '@material-ui/core/Typography';
import GridContainer from '../../../components/Grid/GridContainer';
import GridItem from '../../../components/Grid/GridItem';
import UserDataForm from './UserDataForm';
import RefundAccountForm from './RefundAccountForm';
import CashHistory from './CashHistory';
import CashHistoryTable from './CashHistoryTable';

export default function MyOffice(props) {
  return (
    <div>
      {/* 광고캐시 충전 및 환불, 관리 */}
      <Typography variant="h5">광고캐시 관리</Typography>
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

      {/* 내 업무 관리 */}
      <Typography variant="h5">업무 관리</Typography>
      {/* 계정 관리 */}
      <GridContainer>

        <GridItem xs={12} sm={12} md={6} lg={5} xl={3}>
          <UserDataForm />
        </GridItem>

      </GridContainer>

      {/* 내 업무 관리 */}
      <Typography variant="h5">계정 관리</Typography>
      {/* 계정 관리 */}
      <GridContainer>

        <GridItem xs={12} sm={12} md={6} lg={5} xl={3}>
          <UserDataForm />
        </GridItem>

      </GridContainer>
    </div>
  );
}
