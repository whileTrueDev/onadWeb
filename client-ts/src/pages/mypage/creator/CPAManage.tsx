import React from 'react';
import useGetRequest from '../../../utils/hooks/useGetRequest';

import CPACampaigns from '../../../organisms/mypage/creator/CPAManage/CPACampaigns';
// types
import { AdPickData } from '../../../organisms/mypage/creator/CPAManage/AdpickTypes';

export default function CPAManage(): JSX.Element {
  const getAdpickCampaigns = useGetRequest<null, AdPickData[]>('/creator/cpa/adpick/campaigns');

  return (
    <div>
      CPAManage

      <div style={{ margin: '0px auto', maxWidth: 1430 }}>
        {!getAdpickCampaigns.loading && getAdpickCampaigns.data && (
        <CPACampaigns campaigns={getAdpickCampaigns.data} />
        )}
      </div>
    </div>
  );
}
