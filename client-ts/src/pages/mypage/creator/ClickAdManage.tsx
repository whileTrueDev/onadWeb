import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
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

interface LanidngUrlRes { url: string }
interface AdChatRes { adChatAgreement: 1 | 0 }
interface ClicksRes { adpanel: number; adchat: number }
interface LevelRes { creatorId: string; level: number; exp: number }

export default function AdDashboard(): JSX.Element {
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
    <>

      <GridContainer>
        {!(levelGet.loading || clicksGet.loading || landingUrlGet.loading) ? (
          <GridItem xs={12} xl={6}>
            <GridContainer>
              {/* 광고페이지 현황 */}

              <GridItem xs={12} md={6} lg={3} xl={6}>
                {!levelGet.loading && levelGet.data && (
                <AdDescriptionCard title="내 광고 레벨">
                  <LevelBar level={levelGet.data.level} exp={levelGet.data.exp / 5} />
                </AdDescriptionCard>
                )}
              </GridItem>


              <GridItem xs={12} md={6} lg={3} xl={6}>
                {!clicksGet.loading && clicksGet.data && (
                <AdDescriptionCard
                  title="총 클릭 수"
                  value={clicksGet.data.adchat + clicksGet.data.adpanel}
                  unit="회"
                />
                )}
              </GridItem>

              <GridItem xs={12} md={6} lg={3} xl={6}>
                {!clicksGet.loading && clicksGet.data && (
                <AdDescriptionCard
                  title="채팅 광고 클릭 수"
                  value={clicksGet.data.adchat}
                  unit="회"
                />
                )}
              </GridItem>

              <GridItem xs={12} md={6} lg={3} xl={6}>
                {/* {!clicksGet.loading && clicksGet.data && (
                <AdDescriptionCard title="패널 광고 클릭 수" value={clicksGet.data.adpanel} unit="회" />
                )} */}
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
          <GridItem xs={12} xl={6}>
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

    </>
  );
}
