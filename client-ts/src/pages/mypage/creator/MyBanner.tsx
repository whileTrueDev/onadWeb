import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
// components
import { Typography } from '@material-ui/core';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import Snackbar from '../../../atoms/Snackbar/Snackbar';
import AdChatOnOffCard from '../../../organisms/mypage/creator/ClickAdManage/AdChatOnOffCard';
import AdPanelCard from '../../../organisms/mypage/creator/ClickAdManage/AdPanelCard';
import AdDescriptionCard from '../../../organisms/mypage/creator/ClickAdManage/AdDescriptionCard';
import LevelBar from '../../../organisms/mypage/creator/ClickAdManage/LevelBar';
// hooks
import useGetRequest from '../../../utils/hooks/useGetRequest';
import useDialog from '../../../utils/hooks/useDialog';
import BannerCard, { CampaignData } from '../../../organisms/mypage/creator/CampaignManage/BannerCard';
import NowBroadCard from '../../../organisms/mypage/creator/CampaignManage/NowBroadCard';
import ChatAdInfo from '../../../organisms/mypage/creator/CampaignManage/ChatAdInfo';
import PanelInfo from '../../../organisms/mypage/creator/CampaignManage/PanelInfo';
import AnotherCard from '../../../organisms/mypage/creator/CampaignManage/AnotherCard';
import AnotherCard2 from '../../../organisms/mypage/creator/CampaignManage/AnotherCard2';


interface LanidngUrlRes { url: string }
interface AdChatRes { adChatAgreement: 1 | 0 }
interface ClicksRes { adpanel: number; adchat: number }
interface LevelRes { creatorId: string; level: number; exp: number }

const MyBanner = (): JSX.Element => {
  // 캠페인목록을 조회하기 위한 객체
  const campaignTableGet = useGetRequest<{offset: number; page: number}, CampaignData[]>(
    '/creator/banner/list', {
      offset: 3, page: 0,
    }
  );
  // 배너광고 그만하기 성공시 스낵바
  const banSuccessSnack = useDialog();

  // Landing url
  const landingUrlGet = useGetRequest<null, LanidngUrlRes>('/creator/landing-url');
  // Adchat agreement
  const adchatGet = useGetRequest<null, AdChatRes>('/creator/adchat/agreement');
  // Creator click data
  const clicksGet = useGetRequest<null, ClicksRes>('/creator/clicks');
  // Creator Level data
  const levelGet = useGetRequest<null, LevelRes>('/creator/level');

  // For Onoff success snackbar
  const snack = useDialog();
  const failSnack = useDialog();

  return (
    <div style={{ margin: '0 auto', maxWidth: 1430 }}>
      <GridContainer>
        <GridItem xs={12} md={6}>
          <NowBroadCard />
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <PanelInfo />
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <ChatAdInfo />
        </GridItem>

        <GridItem xs={12} sm={6}>
          <AnotherCard />
        </GridItem>
        <GridItem xs={12} sm={6}>
          <AnotherCard2 />
        </GridItem>


        {/* 진행한 캠페인 정보 */}
        {campaignTableGet.loading && (<Skeleton height={400} variant="rect" animation="wave" />)}
        <GridItem xs={12}>
          <Typography style={{ fontWeight: 'bold' }}>내가 진행한 광고 목록</Typography>
          {!campaignTableGet.loading && campaignTableGet.data && (
          <BannerCard campaignData={campaignTableGet.data} />
          )}
        </GridItem>
      </GridContainer>

      <GridContainer>
        {!(levelGet.loading || clicksGet.loading || landingUrlGet.loading) ? (
          <GridItem xs={12}>
            <GridContainer>
              {/* 광고페이지 현황 */}

              <GridItem xs={12} md={6} lg={3} xl={6}>
                {!levelGet.loading && levelGet.data && (
                <AdDescriptionCard title="내 광고 레벨">
                  <LevelBar level={levelGet.data.level} exp={levelGet.data.exp} />
                </AdDescriptionCard>
                )}
              </GridItem>


              <GridItem xs={12} md={6} lg={3} xl={6}>
                {!clicksGet.loading && clicksGet.data && (
                <AdDescriptionCard
                  title="총 클릭 수"
                  value={(clicksGet.data.adchat
                    ? clicksGet.data.adchat
                    : 0) + (
                    clicksGet.data.adpanel
                      ? clicksGet.data.adpanel : 0)}
                  unit="회"
                />
                )}
              </GridItem>

              <GridItem xs={12} md={6} lg={3} xl={6}>
                {!clicksGet.loading && clicksGet.data && (
                <AdDescriptionCard
                  title="채팅 광고 클릭 수"
                  value={clicksGet.data.adchat ? clicksGet.data.adchat : 0}
                  unit="회"
                />
                )}
              </GridItem>

              <GridItem xs={12} md={6} lg={3} xl={6}>
                {!clicksGet.loading && clicksGet.data && (
                <AdDescriptionCard
                  title="패널 광고 클릭 수"
                  value={clicksGet.data.adpanel ? clicksGet.data.adpanel : 0}
                  unit="회"
                />
                )}
              </GridItem>

            </GridContainer>

            <GridContainer>
              <GridItem xs={12} md={6} lg={6}>
                {!landingUrlGet.loading && landingUrlGet.data && (
                <AdPanelCard creatorUrl={landingUrlGet.data.url} />
                )}
              </GridItem>

              <GridItem xs={12} md={6} lg={6}>
                <AdChatOnOffCard
                  adChatData={adchatGet}
                  doGetReqeustOnOff={adchatGet.doGetRequest}
                  successSnackOpen={snack.handleOpen}
                  failSnackOpen={failSnack.handleOpen}
                />
              </GridItem>
            </GridContainer>

          </GridItem>
        ) : (
          <GridItem xs={12}>
            <GridContainer>
              <GridItem xs={12} md={6} lg={3} xl={6}>
                <Skeleton variant="text" height={250} />
              </GridItem>
              <GridItem xs={12} md={6} lg={3} xl={6}>
                <Skeleton variant="text" height={250} />
              </GridItem>
              <GridItem xs={12} md={6} lg={3} xl={6}>
                <Skeleton variant="text" height={250} />
              </GridItem>
              <GridItem xs={12} md={6} lg={3} xl={6}>
                <Skeleton variant="text" height={250} />
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} md={6} lg={6}>
                <Skeleton variant="rect" height={400} />
              </GridItem>
              <GridItem xs={12} md={6} lg={6}>
                <Skeleton variant="rect" height={400} />
              </GridItem>
            </GridContainer>
          </GridItem>
        )}


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
