import React from 'react';
// core ../../../atoms
import GridContainer from '../../atoms/Grid/GridContainer';
import GridItem from '../../atoms/Grid/GridItem';
import CircularProgress from '../../atoms/Progress/CircularProgress';

import LandingSetting from '../../organisms/creator/LandingManage/LandingSetting';
import LandingImageUploadForm from '../../organisms/creator/LandingManage/LandingImageUploadForm';
import LandingUrl from '../../organisms/creator/LandingManage/LandingUrl';
import LandingDetail from '../../organisms/creator/LandingManage/LandingDetail';
import LandingPanelBanner from '../../organisms/creator/LandingManage/LandingPanelBanner';

import useFetchData from '../../utils/lib/hooks/useFetchData';

function LandingManage() {
  const landingData = useFetchData('/api/dashboard/creator/landing');
  return (
    <div>

      <GridContainer>
        {/* 랜딩페이지 URL 보기 */}
        <GridItem xs={12} xl={8}>
          <LandingUrl userData={landingData} />
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={6} md={6} xl={4}>
          <GridContainer>

            {/* 배경이미지 선택 */}
            <GridItem xs={12}>
              {landingData.loading && (<CircularProgress small />)}
              {!landingData.loading && landingData.payload && (
              <LandingImageUploadForm userData={landingData} />
              )}
            </GridItem>

            {/* 광고페이지 현황 */}
            <GridItem xs={12}>
              <LandingDetail />
            </GridItem>

          </GridContainer>
        </GridItem>

        <GridItem xs={12} sm={6} md={6} xl={4}>
          <GridContainer>

            {/* 랜딩페이지설정 */}
            <GridItem xs={12}>
              {landingData.loading && (<CircularProgress small />)}
              {!landingData.loading && landingData.payload && (
                <LandingSetting userData={landingData} />
              )}
            </GridItem>


            {/* 패널배너 기본이미지 */}
            <GridItem xs={12}>
              <LandingPanelBanner userData={landingData} />
            </GridItem>


          </GridContainer>
        </GridItem>
      </GridContainer>

    </div>
  );
}
export default LandingManage;
