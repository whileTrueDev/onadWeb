import React from 'react';
import { Hidden } from '@material-ui/core';
import GridContainer from '../../atoms/Grid/GridContainer';
import GridItem from '../../atoms/Grid/GridItem';
import WithdrawalCard from '../../organisms/creator/Mypage/WithdrawalCard';
import ProfileCard from '../../organisms/creator/Mypage/ProfileCard';
import useFetchData from '../../utils/lib/hooks/useFetchData';
import AccountCard from '../../organisms/creator/Mypage/AccountCard';
import NotificationCard from '../../organisms/creator/Mypage/NotificationCard';

const Mypage = () => {
  const profileData = useFetchData('/api/dashboard/creator/profile');
  // console.log(profileData);

  return (
    <GridContainer direction="row">
      <GridItem sm={12} md={3}>
        <AccountCard profileData={profileData} />
      </GridItem>
      <GridItem sm={12} md={3}>
        <ProfileCard profileData={profileData} />
      </GridItem>
      <GridItem sm={12} md={4}>
        <WithdrawalCard />
      </GridItem>
      <Hidden mdDown>
        <GridItem md={10}>
          <NotificationCard />
        </GridItem>
      </Hidden>
    </GridContainer>
  );
};

export default Mypage;
