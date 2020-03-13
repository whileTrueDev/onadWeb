import React from 'react';
// core ../../../atoms
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import CircularProgress from '../../../atoms/Progress/CircularProgress';

import AdPageSetting from '../../../organisms/mypage/creator/AdPageManage/AdPageSetting';
import AdPageImageUploadForm from '../../../organisms/mypage/creator/AdPageManage/AdPageImageUploadForm';
import AdPageUrl from '../../../organisms/mypage/creator/AdPageManage/AdPageUrl';
import AdPageDetail from '../../../organisms/mypage/creator/AdPageManage/AdPageDetail';
import AdPagePanelBanner from '../../../organisms/mypage/creator/AdPageManage/AdPagePanelBanner';
import AdPageData from '../../../organisms/mypage/creator/AdPageManage/AdPageData.interfece';

import useGetRequest from '../../../utils/hooks/useGetRequest';

function AdPageManage(): JSX.Element {
  const landingData = useGetRequest<null, AdPageData>('/creator/ad-page');

  return (
    <>
      <GridContainer>
        {/* 랜딩페이지 URL 보기 */}
        <GridItem xs={12} lg={6} xl={4}>
          {landingData.loading && (<CircularProgress small />)}
          {!landingData.loading && landingData.data && (
          <AdPageUrl userData={landingData.data} />
          )}
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={6} md={6} xl={4}>
          <GridContainer>

            {/* 배경이미지 선택 */}
            <GridItem xs={12}>
              {landingData.loading && (<CircularProgress small />)}
              {!landingData.loading && landingData.data && (
              <AdPageImageUploadForm
                userData={landingData.data}
                doGetRequest={landingData.doGetRequest}
              />
              )}
            </GridItem>

            {/* 광고페이지 현황 */}
            <GridItem xs={12}>
              {landingData.loading && (<CircularProgress small />)}
              {!landingData.loading && landingData.data && (
              <AdPageDetail userData={landingData.data} />
              )}
            </GridItem>

          </GridContainer>
        </GridItem>

        <GridItem xs={12} sm={6} md={6} xl={4}>
          <GridContainer>

            {/* 랜딩페이지설정 */}
            <GridItem xs={12}>
              {landingData.loading && (<CircularProgress small />)}
              {!landingData.loading && landingData.data && (
                <AdPageSetting
                  userData={landingData.data}
                  setUserData={landingData.setData}
                />
              )}
            </GridItem>


            {/* 패널배너 기본이미지 */}
            <GridItem xs={12}>
              {landingData.loading && (<CircularProgress small />)}
              {!landingData.loading && landingData.data && (
              <AdPagePanelBanner userData={landingData.data} />
              )}
            </GridItem>

          </GridContainer>
        </GridItem>
      </GridContainer>

    </>
  );
}
export default AdPageManage;
