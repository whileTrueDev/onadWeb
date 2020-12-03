import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import Paper from '@material-ui/core/Paper';
import RemotePageBannerTable, { BannerStatus } from '../../../organisms/mypage/creator/RemotePage/RemotePageBannerTable';
import useGetRequest from '../../../utils/hooks/useGetRequest';
import usePatchRequest from '../../../utils/hooks/usePatchRequest';

interface Params {
  remoteControllerUrl: string;
}
const RemotePage = (): JSX.Element => {
  const thisUrl: string = window.location.pathname.split('/')[3];
  const remoteCampaignTableGet = useGetRequest<Params, BannerStatus[]>('/creator/banner/remote-page', { remoteControllerUrl: thisUrl });

  const onOffUpdate = usePatchRequest('/creator/banner/remote-page', () => {
    remoteCampaignTableGet.doGetRequest();
  });

  return (
    <Paper>
      {remoteCampaignTableGet.loading && (<Skeleton height={400} variant="rect" animation="wave" />)}
      {!remoteCampaignTableGet.loading
        && remoteCampaignTableGet.data && (
        <RemotePageBannerTable
          tableData={remoteCampaignTableGet}
          onOffUpdate={onOffUpdate}
          pageUrl={thisUrl}
        />
      )}
    </Paper>
  );
};

export default RemotePage;
