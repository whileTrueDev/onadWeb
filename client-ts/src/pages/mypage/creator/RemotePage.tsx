import React from 'react';

import Paper from '@material-ui/core/Paper';
import RemotePageBannerTable from '../../../organisms/mypage/creator/RemotePage/RemotePageBannerTable';

const RemotePage = (): JSX.Element => {
  const thisUrl: string = window.location.pathname.split('/')[3];

  return (
    <Paper>
      <RemotePageBannerTable
        pageUrl={thisUrl}
      />
    </Paper>
  );
};

export default RemotePage;
