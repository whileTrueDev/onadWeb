import React from 'react';
import {
  Grid, Hidden
} from '@material-ui/core';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import WithdrawalCard from './WithdrawalCard';
import ProfileCard from './ProfileCard';
import useFetchData from '../../../utils/lib/hooks/useFetchData';
import AccountCard from './AccountCard';

const Mypage = () => {
  const profileData = useFetchData('/api/dashboard/creator/profile');

  return (
    <GridContainer direction="row">
      <GridItem sm={12} md={3}>
        <AccountCard profileData={profileData} />
      </GridItem>
      <GridItem sm={12} md={3}>
        <ProfileCard profileData={profileData} />
      </GridItem>
      <Hidden mdDown>
        <GridItem md={6} />
      </Hidden>
      <GridItem sm={12} md={6}>
        <WithdrawalCard />
      </GridItem>
    </GridContainer>
  );
};

export default Mypage;
