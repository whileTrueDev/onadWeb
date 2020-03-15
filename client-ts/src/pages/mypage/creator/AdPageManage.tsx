import React from 'react';
// core ../../../atoms
import Skeleton from '@material-ui/lab/Skeleton';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';

import AdPageSetting from '../../../organisms/mypage/creator/AdPageManage/AdPageSetting';
import AdPageImageUploadForm from '../../../organisms/mypage/creator/AdPageManage/AdPageImageUploadForm';
import AdPageUrl from '../../../organisms/mypage/creator/AdPageManage/AdPageUrl';
import AdPageDetail from '../../../organisms/mypage/creator/AdPageManage/AdPageDetail';
import AdPagePanelBanner from '../../../organisms/mypage/creator/AdPageManage/AdPagePanelBanner';
import AdPageData from '../../../organisms/mypage/creator/AdPageManage/AdPageData.interfece';
import Snackbar from '../../../atoms/Snackbar/Snackbar';

import useDialog from '../../../utils/hooks/useDialog';
import useGetRequest from '../../../utils/hooks/useGetRequest';

function AdPageManage(): JSX.Element {
  const landingData = useGetRequest<null, AdPageData>('/creator/ad-page');
  const snack = useDialog(); // for success sanckbar
  const failSnack = useDialog(); // for fail Snack

  return (
    <>
      <GridContainer>
        {/* 랜딩페이지 URL 보기 */}
        <GridItem xs={12} lg={6} xl={4}>
          {landingData.loading && (<Skeleton variant="text" height={100} />)}
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
              {landingData.loading && (<Skeleton variant="rect" height={500} />)}
              {!landingData.loading && landingData.data && (
              <AdPageImageUploadForm
                userData={landingData.data}
                handleSnackOpen={snack.handleOpen}
              />
              )}
            </GridItem>

            {/* 광고페이지 현황 */}
            <GridItem xs={12}>
              {landingData.loading && (<Skeleton variant="text" height={300} />)}
              {!landingData.loading && landingData.data && (
              <AdPageDetail userData={landingData.data} />
              )}
            </GridItem>

          </GridContainer>
        </GridItem>

        <GridItem xs={12} sm={6} md={6} xl={4}>
          <GridContainer spacing={3}>

            {/* 랜딩페이지설정 */}
            <GridItem xs={12}>
              {landingData.loading && (<Skeleton variant="rect" height={300} />)}
              {!landingData.loading && landingData.data && (
                <AdPageSetting
                  userData={landingData.data}
                  setUserData={landingData.setData}
                  handleSnackOpen={snack.handleOpen}
                />
              )}
            </GridItem>


            {/* 패널배너 기본이미지 */}
            <GridItem xs={12}>
              {landingData.loading && (<Skeleton variant="text" height={450} />)}
              {!landingData.loading && landingData.data && (
              <AdPagePanelBanner userData={landingData.data} />
              )}
            </GridItem>

          </GridContainer>
        </GridItem>
      </GridContainer>

      <Snackbar
        color="success"
        open={snack.open}
        message="정상적으로 변경되었습니다."
        onClose={snack.handleClose}
      />

      <Snackbar
        color="error"
        open={failSnack.open}
        message="변경중 오류가 발생했습니다."
        onClose={failSnack.handleClose}
      />
    </>
  );
}
export default AdPageManage;
