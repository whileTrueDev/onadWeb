import { Button, Typography } from '@material-ui/core';
import * as React from 'react';
import Router from 'next/router';
import GridContainer from '../../../../atoms/grid/gridContainer';
import GridItem from '../../../../atoms/grid/gridItem';
import BannerList from '../../../../components/mypage/creator/ad/campaigns/bannerList';
import { useCreatorProfile } from '../../../../utils/hooks/query/useCreatorProfile';
import DashboardLayout from '../../../../components/mypage/layouts/creatorDashboardLayout';

export default function ProgressedCampaigns(): React.ReactElement {
  const creatorProfile = useCreatorProfile();

  return (
    <div style={{ margin: '0 auto', maxWidth: 1430 }}>
      {/* 진행한 캠페인 정보 */}
      <GridContainer>
        <GridItem xs={12}>
          {!creatorProfile.isLoading &&
            creatorProfile.data &&
            creatorProfile.data.creatorContractionAgreement === 1 && <BannerList />}

          {!creatorProfile.isLoading &&
            creatorProfile.data &&
            creatorProfile.data.creatorContractionAgreement !== 1 && (
              <div style={{ textAlign: 'center' }}>
                <Typography>아직 진행한 광고가 없어요!</Typography>
                <Typography>
                  방송 채널 연동 및 이용 동의를 진행하고, 광고를 진행해보세요!
                </Typography>
                <Button
                  disableElevation
                  variant="contained"
                  color="primary"
                  onClick={() => Router.push('/mypage/creator/user')}
                >
                  채널 연동 하러가기
                </Button>
              </div>
            )}
        </GridItem>
      </GridContainer>
    </div>
  );
}

ProgressedCampaigns.layout = DashboardLayout;
