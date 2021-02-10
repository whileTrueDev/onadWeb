import React from 'react';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import ProfileCard from '../../../organisms/mypage/creator/Mypage/ProfileCard';
import PlatformLinkCard from '../../../organisms/mypage/creator/Mypage/PlatformLinkCard';
import useGetRequest from '../../../utils/hooks/useGetRequest';
import CenterLoading from '../../../atoms/Loading/CenterLoading';
import useMypageScrollToTop from '../../../utils/hooks/useMypageScrollToTop';

const Mypage = (): JSX.Element => {
  // 프로필 유저 데이터
  const profileData = useGetRequest('/creator');
  // 출금 내역 데이터
  const withdrawalData = useGetRequest('/creator/income/withdrawal');

  useMypageScrollToTop();
  return (
    <div style={{ margin: '0 auto', maxWidth: 1024 }}>

      <GridContainer direction="row">
        <GridItem xs={12}>
          {(profileData.loading || withdrawalData.loading) && (<CenterLoading />)}
          {!(profileData.loading || withdrawalData.loading) && profileData.data && (
          <PlatformLinkCard
            profileData={profileData.data}
            profileRefetch={profileData.doGetRequest}
          />
          )}
        </GridItem>
        <GridItem xs={12}>
          {!(profileData.loading || withdrawalData.loading) && profileData.data && (
          <ProfileCard profileData={profileData.data} />
          )}
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default Mypage;
