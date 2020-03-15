import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
// components
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import Snackbar from '../../../atoms/Snackbar/Snackbar';
import CampaignTableCard from '../../../organisms/mypage/creator/CampaignManage/CampaignTableCard';
import { CampaignTableData } from '../../../organisms/mypage/creator/CampaignManage/sub/CampaignTable';
// hooks
import useDialog from '../../../utils/hooks/useDialog';
import useGetRequest from '../../../utils/hooks/useGetRequest';

const CampaignManage = (): JSX.Element => {
  // 캠페인목록을 조회하기 위한 객체
  const campaignTableGet = useGetRequest<null, CampaignTableData[]>('/creator/banner/list');
  // 배너광고 그만하기 성공시 스낵바
  const banSuccessSnack = useDialog();

  return (
    <>
      <GridContainer direction="row">
        <GridItem sm={12} md={10}>
          {campaignTableGet.loading && (<Skeleton height={400} variant="rect" animation="wave" />)}
          {!campaignTableGet.loading && campaignTableGet.data && (
          <CampaignTableCard
            campaignTableData={campaignTableGet.data}
            doCampaignTableDataRequest={campaignTableGet.doGetRequest}
            handleSnackOpen={banSuccessSnack.handleOpen}
          />
          )}
        </GridItem>
      </GridContainer>

      <Snackbar
        open={banSuccessSnack.open}
        message="배너광고 거절이 성공하였습니다."
        color="success"
        onClose={banSuccessSnack.handleClose}
      />
    </>
  );
};
export default CampaignManage;
