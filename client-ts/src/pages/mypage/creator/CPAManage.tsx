import React from 'react';
import useGetRequest from '../../../utils/hooks/useGetRequest';

import CPACampaigns from '../../../organisms/mypage/creator/CPAManage/CPACampaigns';
import CPAIncomeTable from '../../../organisms/mypage/creator/CPAManage/CPAIncomeTable';
// types
import { CampaignResult, AdPickIncome } from '../../../organisms/mypage/creator/CPAManage/AdpickTypes';

export default function CPAManage(): JSX.Element {
  const getAdpickCampaigns = useGetRequest<null, CampaignResult[]>('/creator/cpa/adpick/campaigns');
  const getCampaignIncomes = useGetRequest<null, AdPickIncome[]>('/creator/cpa/adpick/incomes');
  return (
    <div style={{ margin: '0px auto', maxWidth: 1430 }}>
      {!getCampaignIncomes.loading
      && getCampaignIncomes.data
      && getCampaignIncomes.data.length > 0
      && (
        <CPAIncomeTable campaignIncomes={getCampaignIncomes.data} />
      )}

      {!getAdpickCampaigns.loading && getAdpickCampaigns.data
      && (
        <CPACampaigns
          campaigns={getAdpickCampaigns.data}
          getCampaign={getAdpickCampaigns.doGetRequest}
        />
      )}
    </div>
  );
}
