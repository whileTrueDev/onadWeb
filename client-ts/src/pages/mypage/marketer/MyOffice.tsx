import React from 'react';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';

import UserDataForm from '../../../organisms/mypage/marketer/office/profile/UserDataForm';
import RefundAccountForm from '../../../organisms/mypage/marketer/office/refund/RefundAccountForm';
import BusinessRegistration from '../../../organisms/mypage/marketer/office/business/BusinessUploadForm';
import SignOut from '../../../organisms/mypage/marketer/office/profile/SignOut';
import MyOffceLoading from '../../../organisms/mypage/marketer/office/MyOfficeLoading';

import {
  BusinessInterface, UserInterface, AccountInterface
} from '../../../organisms/mypage/marketer/office/interface';
import useGetRequest from '../../../utils/hooks/useGetRequest';


import MyCash from '../../../organisms/mypage/marketer/office/cash/MyCash';
import CashHistoryTable from '../../../organisms/mypage/marketer/office/cash/CashHistoryTable';
import RefundHistoryTable from '../../../organisms/mypage/marketer/office/refund/RefundHistoryTable';


import TaxBill from '../../../organisms/mypage/marketer/office/TaxBill';

export default function MyOffice(): JSX.Element {
  // 계좌 정보
  const accountData = useGetRequest<null, AccountInterface | null>('/marketer/account');
  const userData = useGetRequest<null, UserInterface | null>('/marketer');
  const businessRegistrationData = useGetRequest<null, BusinessInterface | null>('/marketer/business');

  return (
    <div style={{ margin: '0 auto', maxWidth: 1430 }}>
      {/* 계정 관리 */}
      {userData.loading && (<MyOffceLoading />)}
      {!userData.loading && userData.data && (
        <div>
          <GridContainer>
            <GridItem xs={12}>
              <UserDataForm userData={userData.data} doGetRequest={userData.doGetRequest} />
            </GridItem>
          </GridContainer>

          <GridContainer>
            <GridItem xs={12} lg={6}>
              <BusinessRegistration businessRegistrationData={businessRegistrationData} />
            </GridItem>
            <GridItem xs={12} lg={6}>
              <RefundAccountForm accountData={accountData} />
            </GridItem>
          </GridContainer>
        </div>
      )}

      {/* 광고캐시 충전 및 환불, 관리 */}
      <GridContainer>
        <GridItem xs={12}>
          <MyCash accountData={accountData} userData={userData} />
        </GridItem>
      </GridContainer>

      <GridContainer>
        {/* 충전 내역 */}
        <GridItem xs={12} lg={6}>
          <CashHistoryTable />
        </GridItem>
        {/* 환불 내역 */}
        <GridItem xs={12} lg={6}>
          <RefundHistoryTable />
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12}>
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

    </div>
  );
}
