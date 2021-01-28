import React from 'react';
import { Typography } from '@material-ui/core';
import { AccountInterface, UserInterface } from '../../../organisms/mypage/marketer/office/interface';
import { useGetRequest } from '../../../utils/hooks';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import UserDataForm from '../../../organisms/mypage/marketer/office/profile/UserDataForm';
import SignOut from '../../../organisms/mypage/marketer/office/profile/SignOut';

export default function MyInfo(): JSX.Element {
  const userData = useGetRequest<null, UserInterface | null>('/marketer');
  const accountData = useGetRequest<null, AccountInterface | null>('/marketer/account');

  return (
    <div style={{ margin: '0 auto', maxWidth: 1430 }}>
      {/* 계정 관리 */}
      {!userData.loading && userData.data && !accountData.loading && (
        <div>
          <GridContainer>
            <GridItem xs={12}>
              <Typography style={{ marginTop: 16 }} variant="h6">내 정보 관리</Typography>
            </GridItem>
            <GridItem xs={12} lg={6}>
              <UserDataForm
                userData={userData.data}
                doGetRequest={userData.doGetRequest}
              />
            </GridItem>
          </GridContainer>

          {/* 회원탈퇴 */}
          <GridContainer>
            <GridItem xs={12}>
              <SignOut userData={userData.data} />
            </GridItem>
          </GridContainer>
        </div>
      )}
    </div>
  );
}
