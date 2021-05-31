import { Button, Typography } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import BannerList from '../../../../organisms/mypage/creator/CampaignManage/BannerList';
import { useGetRequest } from '../../../../utils/hooks';
import { ContractionDataType } from '../CPAManage';


export default function ProgressedCampaigns(): React.ReactElement {
  const history = useHistory();
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

          {!profileGet.loading && profileGet.data
          && profileGet.data.creatorContractionAgreement !== 1 && (
            <div style={{ textAlign: 'center' }}>
              <Typography>아직 진행한 광고가 없어요!</Typography>
              <Typography>방송 채널 연동을 진행하고, 광고를 진행해보세요!</Typography>
              <Button
                disableElevation
                variant="contained"
                color="primary"
                onClick={(): void => history.push('/mypage/creator/user')}
              >
                채널 연동 하러가기
              </Button>
            </div>
          )}
        </GridItem>
      </GridContainer>
    </div>
  );
}
