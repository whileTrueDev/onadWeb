import React, { useEffect } from 'react';
import { Hidden } from '@material-ui/core';
import GridContainer from '../../atoms/Grid/GridContainer';
import GridItem from '../../atoms/Grid/GridItem';
import WithdrawalCard from '../../organisms/creator/Mypage/WithdrawalCard';
import ProfileCard from '../../organisms/creator/Mypage/ProfileCard';
import useFetchData from '../../utils/lib/hooks/useFetchData';
import AccountCard from '../../organisms/creator/Mypage/AccountCard';
import NotificationCard from '../../organisms/creator/Mypage/NotificationCard';
import axios from '../../utils/axios';
import HOST from '../../utils/config';

const Mypage = () => {
  const profileData = useFetchData('/api/dashboard/creator/profile');
  // console.log(profileData);

  // useEffect(() => {
  //   axios.get(`${HOST}/api/regist/account`).then(() => {
  //     console.log('요청완료');
  //   });
  // }, []);

  return (
    <GridContainer direction="row">
      <GridItem sm={12} md={6} xl={3}>
        <AccountCard profileData={profileData} />
      </GridItem>
      <GridItem sm={12} md={6} xl={3}>
        <ProfileCard profileData={profileData} />
      </GridItem>
      <GridItem sm={12} xl={4}>
        <WithdrawalCard />
      </GridItem>
      <Hidden smDown>
        <GridItem md={12} xl={10}>
          <NotificationCard />
        </GridItem>
      </Hidden>
    </GridContainer>
  );
};

export default Mypage;
