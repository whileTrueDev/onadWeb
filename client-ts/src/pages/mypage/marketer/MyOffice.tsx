import React from 'react';
import Typography from '@material-ui/core/Typography';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';

import UserDataForm from '../../../organisms/mypage/marketer/office/UserDataForm';
import RefundAccountForm from '../../../organisms/mypage/marketer/office/RefundAccountForm';
import MyCash from '../../../organisms/mypage/marketer/office/MyCash';
import CashHistoryTable from '../../../organisms/mypage/marketer/office/CashHistoryTable';
import RefundHistoryTable from '../../../organisms/mypage/marketer/office/RefundHistoryTable';
import BusinessRegistration from '../../../organisms/mypage/marketer/office/BusinessUploadForm';
import SignOut from '../../../organisms/mypage/marketer/office/SignOut';
import MyOffceLoading from '../../../organisms/mypage/marketer/office/MyOfficeLoading';
import TaxBill from '../../../organisms/mypage/marketer/office/TaxBill';

import { businessInterface, userInterface, accountInterface } from '../../../organisms/mypage/marketer/office/interface';
import useGetRequest from '../../../utils/hooks/useGetRequest';


export default function MyOffice() {

  // 계좌 정보
  const accountData = useGetRequest<null, accountInterface | null>('/marketer/account');
  const userData = useGetRequest<null, userInterface | null>('/marketer');
  const businessRegistrationData = useGetRequest<null, businessInterface | null>('/marketer/business');


  return (
    <>

      <Typography variant="h5" style={{ marginTop: 35 }} color="textPrimary">내정보관리</Typography>
      {/* 계정 관리 */}
      {userData.loading && (
        <MyOffceLoading />
      )}
      {!userData.loading && userData.data && (
        <GridContainer>
          <GridItem xs={12} sm={12} md={12} lg={6} xl={3}>
            <UserDataForm userData={userData.data} doGetRequest={userData.doGetRequest} />
          </GridItem>

          <GridItem xs={12} lg={6} xl={3}>
            <GridContainer>
              {userData.data.marketerUserType ? (
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

      <Typography variant="h5" style={{ marginTop: 35 }} color="textPrimary">광고캐시 관리</Typography>
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

      <Typography variant="h5" style={{ marginTop: 35 }}>세금계산서 관리</Typography>
      <GridContainer>
        <GridItem xs={12} md={12} lg={8} xl={6}>
          <TaxBill />
        </GridItem>
      </GridContainer>

      {/* 회원탈퇴 */}
      {!userData.loading && userData.data && (
        <GridContainer>
          <GridItem xs={12}>
            <SignOut userData={userData.data} />
          </GridItem>
        </GridContainer>
      )}

    </>
  );
}
