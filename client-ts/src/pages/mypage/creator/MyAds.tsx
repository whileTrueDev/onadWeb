import React from 'react';
// components
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import Snackbar from '../../../atoms/Snackbar/Snackbar';
// hooks
import useGetRequest from '../../../utils/hooks/useGetRequest';
import useDialog from '../../../utils/hooks/useDialog';
import BannerList from '../../../organisms/mypage/creator/CampaignManage/BannerList';
import NowBroadCard, { CurrentBannerRes } from '../../../organisms/mypage/creator/CampaignManage/NowBroadCard';
import ChatAdInfo from '../../../organisms/mypage/creator/CampaignManage/ChatAdInfo';
import ClickAdInfo from '../../../organisms/mypage/creator/CampaignManage/ClickAdInfo';
import AdIncomeCard from '../../../organisms/mypage/creator/shared/AdIncomeCard';
import AdClickCard from '../../../organisms/mypage/creator/CampaignManage/AdClickCard';
import StartGuideCard from '../../../organisms/mypage/creator/shared/StartGuideCard';
import { ContractionDataType } from './CPAManage';
import OverlayUrlCard, { OverlayUrlRes } from '../../../organisms/mypage/creator/shared/OverlayUrlCard';


interface LanidngUrlRes { url: string }
interface AdChatRes { adChatAgreement: 1 | 0 }
interface ClicksRes { adpanel: number; adchat: number }
interface LevelRes { creatorId: string; level: number; exp: number }

const MyBanner = (): JSX.Element => {
  // 배너광고 그만하기 성공시 스낵바
  const banSuccessSnack = useDialog();

  // Adchat agreement
  const adchatGet = useGetRequest<null, AdChatRes>('/creator/adchat/agreement');
  // Creator click data
  const clicksSummaryGet = useGetRequest<null, ClicksRes>('/creator/clicks');
  // Creator Level data
  const levelGet = useGetRequest<null, LevelRes>('/creator/level');
  // 현재 송출중 배너 정보 조회
  const currentBannerGet = useGetRequest<null, CurrentBannerRes[]>('/creator/banner/active');
  // 계약 정보 조회
  const profileGet = useGetRequest<null, ContractionDataType>('/creator');
  // 배너 송출 URL 정보 조회
  const overlayUrlGet = useGetRequest<null, OverlayUrlRes>('/creator/banner/overlay');

  // 리모트 컨트롤러 URL 정보
  const remoteControllerUrlGet = useGetRequest<null, string>('/creator/banner/remote-page-url');

  // For Onoff success snackbar
  const snack = useDialog();
  const failSnack = useDialog();
  const overlayUrlCopySnack = useDialog();

  return (
    <div style={{ margin: '0 auto', maxWidth: 1430 }}>
      <GridContainer>

        {/* 광고 시작 가이드 */}
        <GridItem xs={12} lg={6}>
          {!overlayUrlGet.loading && overlayUrlGet.data
            && !profileGet.loading && profileGet.data && (
            <StartGuideCard
              doContractionDataRequest={profileGet.doGetRequest}
              doOverlayUrlDataRequest={overlayUrlGet.doGetRequest}
              overlayUrlData={overlayUrlGet.data}
              contractionData={profileGet.data}
              handleSnackOpen={snack.handleOpen}
            />
          )}
        </GridItem>

        {/* 배너 광고 오버레이 URL */}
        <GridItem xs={12} lg={6}>
          {overlayUrlGet.loading && (
          <OverlayUrlCard
            overlayUrlData={{
              advertiseUrl: '',
              creatorContractionAgreement: 0
            }}
            handleSnackOpen={overlayUrlCopySnack.handleOpen}
          />
          )}
          {!overlayUrlGet.loading && overlayUrlGet.data && (
            <OverlayUrlCard
              overlayUrlData={overlayUrlGet.data}
              handleSnackOpen={overlayUrlCopySnack.handleOpen}
            />
          )}
        </GridItem>

        {/* 현재 송출 배너 광고 정보 */}
        <GridItem xs={12} lg={6}>
          <NowBroadCard
            currentBannerGet={currentBannerGet}
            remoteControllerUrlGet={remoteControllerUrlGet}
          />
        </GridItem>

        {/* 클릭광고 정보 */}
        <GridItem xs={12} sm={6} lg={3}>
          <ClickAdInfo profileData={profileGet} />
        </GridItem>

        {/* 채팅광고 정보 */}
        <GridItem xs={12} sm={6} lg={3}>
          <ChatAdInfo
            contracitonAgreementData={profileGet}
            adChatData={adchatGet}
            doGetReqeustOnOff={adchatGet.doGetRequest}
            successSnackOpen={snack.handleOpen}
            failSnackOpen={failSnack.handleOpen}
          />
        </GridItem>

        <GridItem xs={12} lg={6}>
          <AdIncomeCard />
        </GridItem>
        <GridItem xs={12} lg={6}>
          <AdClickCard
            clicksSummaryData={clicksSummaryGet}
            levelData={levelGet}
          />
        </GridItem>


        {/* 진행한 캠페인 정보 */}
        <GridItem xs={12}>
          {!profileGet.loading && profileGet.data
          && profileGet.data.creatorContractionAgreement === 1 && (
          <BannerList />
          )}
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

      <Snackbar
        open={banSuccessSnack.open}
        message="배너광고 거절을 완료하였습니다."
        color="success"
        onClose={banSuccessSnack.handleClose}
      />

      <Snackbar
        open={overlayUrlCopySnack.open}
        message="클립보드에 복사되었어요! 방송도구에 등록해주세요"
        color="success"
        onClose={overlayUrlCopySnack.handleClose}
      />

    </div>
  );
};
export default MyBanner;
