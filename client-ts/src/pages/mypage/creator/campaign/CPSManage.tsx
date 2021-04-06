import React from 'react';
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import CPSChart, { CpsChartData } from '../../../../organisms/mypage/creator/CampaignManage/cps/CPSChart';
import CPSReviews, { CPSReview } from '../../../../organisms/mypage/creator/CampaignManage/cps/CPSReviews';
import CPSMetaInfo, { CpsMetaInfoRes } from '../../../../organisms/mypage/creator/CampaignManage/cps/CPSMetaInfo';
import { useGetRequest } from '../../../../utils/hooks';


export default function CPSManage(): React.ReactElement {
  const cpsMetaInfo = useGetRequest<null, CpsMetaInfoRes>('/creator/cps');
  const cpsChartData = useGetRequest<null, CpsChartData[]>('/creator/cps/chart');
  const cpsReviewData = useGetRequest<null, CPSReview[]>('/creator/cps/reviews');

  return (
    <div style={{ margin: '0 auto', maxWidth: 1430 }}>

      <GridContainer>

        <GridItem xs={12}>
          <CPSMetaInfo
            cpsMetaInfo={cpsMetaInfo}
          />
        </GridItem>

        <GridItem xs={12}>
          <CPSChart cpsChartData={cpsChartData} />
        </GridItem>

        <GridItem xs={12}>
          <CPSReviews cpsReviewData={cpsReviewData} />
        </GridItem>

      </GridContainer>

    </div>
  );
}
