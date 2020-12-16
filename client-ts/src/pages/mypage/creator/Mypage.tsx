import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import ProfileCard from '../../../organisms/mypage/creator/Mypage/ProfileCard';
import PlatformLinkCard from '../../../organisms/mypage/creator/Mypage/PlatformLinkCard';
import useGetRequest from '../../../utils/hooks/useGetRequest';

const Mypage = (): JSX.Element => {
  // 프로필 유저 데이터
  const profileData = useGetRequest('/creator');
  // 출금 내역 데이터
  const withdrawalData = useGetRequest('/creator/income/withdrawal');

  return (
    <div style={{ margin: '0 auto', maxWidth: 1024 }}>

      <GridContainer direction="row">
        <GridItem xs={12}>
          {(profileData.loading || withdrawalData.loading) && (<Skeleton height={400} variant="rect" />)}
          {!(profileData.loading || withdrawalData.loading) && profileData.data && (
          <PlatformLinkCard profileData={profileData.data} />
          )}
        </GridItem>
        <GridItem xs={12}>
          {(profileData.loading || withdrawalData.loading) && (<Skeleton height={400} variant="rect" />)}
          {!(profileData.loading || withdrawalData.loading) && profileData.data && (
          <ProfileCard profileData={profileData.data} />
          )}
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default Mypage;
