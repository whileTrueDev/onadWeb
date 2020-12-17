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
import { ContractionDataType } from './CPAManage';


interface LanidngUrlRes { url: string }
interface AdChatRes { adChatAgreement: 1 | 0 }
interface ClicksRes { adpanel: number; adchat: number }
interface LevelRes { creatorId: string; level: number; exp: number }

const MyBanner = (): JSX.Element => {
  // 배너광고 그만하기 성공시 스낵바
  const banSuccessSnack = useDialog();

  // Landing url
  const landingUrlGet = useGetRequest<null, LanidngUrlRes>('/creator/landing-url');
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

  // For Onoff success snackbar
  const snack = useDialog();
  const failSnack = useDialog();

  console.log(profileGet.data);
  return (
    <div style={{ margin: '0 auto', maxWidth: 1430 }}>
      <GridContainer>

        {/* 현재 송출 배너 광고 정보 */}
        <GridItem xs={12} lg={6}>
          <NowBroadCard currentBannerGet={currentBannerGet} />
        </GridItem>

        {/* 클릭광고 정보 */}
        <GridItem xs={12} sm={6} lg={3}>
          <ClickAdInfo
            creatorUrl={
            (!profileGet.loading && profileGet.data
              && profileGet.data.creatorContractionAgreement && landingUrlGet.data)
              ? landingUrlGet.data.url
              : ''
            }
          />
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
        message="배너광고 거절이 성공하였습니다."
        color="success"
        onClose={banSuccessSnack.handleClose}
      />
    </div>
  );
};
export default MyBanner;
