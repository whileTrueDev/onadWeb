import React from 'react';
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import BannerList from '../../../../organisms/mypage/creator/CampaignManage/BannerList';
import { useGetRequest } from '../../../../utils/hooks';
import { ContractionDataType } from '../CPAManage';


export default function ProgressedCampaigns(): React.ReactElement {
  const profileGet = useGetRequest<null, ContractionDataType>('/creator');

  return (
    <div style={{ margin: '0 auto', maxWidth: 1430 }}>
      {/* 진행한 캠페인 정보 */}
      <GridContainer>
        <GridItem xs={12}>
          {!profileGet.loading && profileGet.data
          && profileGet.data.creatorContractionAgreement === 1 && (
          <BannerList />
          )}
        </GridItem>
      </GridContainer>
    </div>
  );
}
