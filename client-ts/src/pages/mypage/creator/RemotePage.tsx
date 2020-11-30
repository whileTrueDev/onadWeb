import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import GridContainer from '../../../atoms/Grid/GridContainer';

import RemotePageBannerTable, { BannerStatus } from '../../../organisms/mypage/creator/RemotePage/RemotePageBannerTable';
import useGetRequest from '../../../utils/hooks/useGetRequest';
// import  from '../../../organisms/mypage/creator/RemotePage/RemotePageBannerTable';
interface Params {
  remoteControllerUrl: string;
}
const RemotePage = (): JSX.Element => {
  const thisUrl: string = window.location.pathname.split('/')[3];
  console.log(thisUrl);
  const remoteCampaignTableGet = useGetRequest<Params, BannerStatus[]>('/creator/banner/remote-page', { remoteControllerUrl: thisUrl });
  const profileData = useGetRequest('/creator/banner/remote-page-creator-name');
  return (
    <GridContainer direction="row">
      {remoteCampaignTableGet.loading && (<Skeleton height={400} variant="rect" animation="wave" />)}
      {!profileData.loading && !remoteCampaignTableGet.loading
      && profileData.data && remoteCampaignTableGet.data && (
      <RemotePageBannerTable
        creatorName={profileData.data.creatorName}
        tableData={remoteCampaignTableGet}
        remoteCampaignOnOff={remoteCampaignTableGet.doGetRequest}
      />
      )}
    </GridContainer>
  );
};

export default RemotePage;
