import { Link } from 'react-router-dom';
// core ../../../atoms
import { Skeleton, Alert } from '@material-ui/lab';
import { Typography } from '@material-ui/core';
import { SpeakerNotes } from '@material-ui/icons';
import GridContainer from '../src/atoms/Grid/GridContainer';
import GridItem from '../src/atoms/Grid/GridItem';

import AdPageSetting from './organisms/AdPageManage/AdPageSetting';
import AdPageImageUploadForm from './organisms/AdPageManage/AdPageImageUploadForm';
import AdPageUrl from './organisms/AdPageManage/AdPageUrl';
import AdPageDetail from './organisms/AdPageManage/AdPageDetail';
import AdPagePanelBanner from './organisms/AdPageManage/AdPagePanelBanner';
import AdPageData from './organisms/AdPageManage/AdPageData.interfece';
// import Snackbar from './src/atoms/Snackbar/Snackbar';

import useDialog from '../src/utils/hooks/useDialog';
import useGetRequest from '../src/utils/hooks/useGetRequest';

function AdPageManage(): JSX.Element {
  const landingData = useGetRequest<null, AdPageData>('/creator/ad-page');
  const snack = useDialog(); // for success sanckbar
  const failSnack = useDialog(); // for fail Snack

  return (
    <>
      <GridContainer>
        <GridItem xs={12} xl={8}>
          <Alert severity="warning">
            <Typography variant="h6">내 광고페이지 변경 관련 알림</Typography>
            <Typography variant="body1">‘내 광고페이지’ 기능이 4월 21일에 중단됩니다.</Typography>
            <Typography variant="body1">
              광고페이지로 이동되던 링크 주소는 ‘패널 광고’ 주소로 사용됩니다. (우측 ‘내 클릭 광고’
              클릭 후 ‘패널 광고 설정’ 확인)
            </Typography>
            <Typography variant="body1">
              ‘내 광고페이지’ 기능 중단 안내에 대한 자세한 사항을{' '}
              <Typography
                variant="h6"
                component={Link}
                to="/mypage/creator/notice"
                style={{ verticalAlign: 'center' }}
              >
                공지사항
                <SpeakerNotes />
              </Typography>{' '}
              에서 꼭 확인해주세요!
            </Typography>
          </Alert>
        </GridItem>
      </GridContainer>
      <GridContainer>
        {/* 랜딩페이지 URL 보기 */}
        <GridItem xs={12} lg={6} xl={4}>
          {landingData.loading && <Skeleton variant="text" height={100} />}
          {!landingData.loading && landingData.data && <AdPageUrl userData={landingData.data} />}
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={6} md={6} xl={4}>
          <GridContainer>
            {/* 배경이미지 선택 */}
            <GridItem xs={12}>
              {landingData.loading && <Skeleton variant="rect" height={500} />}
              {!landingData.loading && landingData.data && (
                <AdPageImageUploadForm
                  userData={landingData.data}
                  handleSnackOpen={snack.handleOpen}
                />
              )}
            </GridItem>

            {/* 광고페이지 현황 */}
            <GridItem xs={12}>
              {landingData.loading && <Skeleton variant="text" height={300} />}
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
              {landingData.loading && <Skeleton variant="rect" height={300} />}
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
              {landingData.loading && <Skeleton variant="text" height={450} />}
              {!landingData.loading && landingData.data && (
                <AdPagePanelBanner userData={landingData.data} />
              )}
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>

      {/* <Snackbar
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
      /> */}
    </>
  );
}
export default AdPageManage;
