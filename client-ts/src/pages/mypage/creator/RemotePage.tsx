import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import GridContainer from '../../../atoms/Grid/GridContainer';

import RemotePageBannerTable, { BannerStatus } from '../../../organisms/mypage/creator/RemotePage/RemotePageBannerTable';
import useGetRequest from '../../../utils/hooks/useGetRequest';
// import  from '../../../organisms/mypage/creator/RemotePage/RemotePageBannerTable';

const RemotePage = (): JSX.Element => (
  <GridContainer direction="row">
    <RemotePageBannerTable />
  </GridContainer>
);

export default RemotePage;
