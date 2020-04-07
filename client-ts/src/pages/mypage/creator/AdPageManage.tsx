import React from 'react';
// core ../../../atoms
import Skeleton from '@material-ui/lab/Skeleton';
import Alert from '@material-ui/lab/Alert';
import SpeakerNotes from '@material-ui/icons/SpeakerNotes';
import { Typography } from '@material-ui/core';
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
        <GridItem xs={12} lg={6}>
          <Alert severity="warning" style={{ alignItems: 'center' }}>
            <Typography>
              소수의 크리에이터를 대상으로 진행한 참여형캠페인(CPA) 테스트 결과, 광고언급과 참여유도가 시청자참여에 영향이 있음을 확인하였습니다.
            </Typography>
            <Typography>
              따라서, 현 &quot;광고페이지&quot;는 &quot;참여형 광고페이지&quot;로 변경되며,
              4월 21일 이후 &quot;광고페이지&quot;기능은 중단됩니다.
            </Typography>
            <Typography>
              참여형 광고페이지 에서는 사전예약, 회원가입 등 액션이 발생하면 수익금을 얻는 형태의 광고를 진행할 수 있습니다.
            </Typography>
            <Typography variant="caption">
              - 크리에이터 여러분은 참여형 광고 페이지의 링크를 새롭게 발급받게 됩니다. 패널에 새로 게시하여 광고 유입을 유도할 수 있습니다.
            </Typography>
            <Typography variant="caption">
              - &quot;광고페이지&quot;는 4월 21일 기능이 중단됩니다. &quot;참여형 광고페이지&quot;는 5월 중 서비스를 진행할 예정입니다.
            </Typography>
            <Typography variant="caption">
              - 기존의 &quot;광고페이지&quot;로 이동되던 링크[https://l.onad.io/creator-name] 는 &quot;패널광고&quot; 링크로 사용됩니다.
            </Typography>
            <Typography variant="caption">
              - &quot;패널광고&quot;에 대한 내용은 내 클릭광고 탭에서 확인하세요!
            </Typography>
            <Typography>
              더욱 자세한 사항은 우측 상단
              {' '}
              <SpeakerNotes />
              {' '}
              공지사항을 통해 확인하세요.
            </Typography>
          </Alert>
        </GridItem>
      </GridContainer>
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
