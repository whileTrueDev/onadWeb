import { CircularProgress, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';


export interface CpsMetaInfoRes {
  income: number; salesCount: number; clickCount: number;
}

interface CPSMetaInfoProps {
  cpsMetaInfo: UseGetRequestObject<CpsMetaInfoRes>;
}
export default function CPSMetaInfo({
  cpsMetaInfo,
}: CPSMetaInfoProps): React.ReactElement {
  return (
    <Paper style={{ padding: 32, marginTop: 8, minHeight: 60 }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        {cpsMetaInfo.loading && (<CircularProgress />)}
        {!cpsMetaInfo.loading && cpsMetaInfo.data && (
          <>
            <div style={{ textAlign: 'center' }}>
              <Typography>판매 누적 수익금</Typography>
              <Typography style={{ fontWeight: 'bold' }} variant="h6">
                {(cpsMetaInfo.data.income || 0).toLocaleString()}
              </Typography>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Typography>판매</Typography>
              <Typography style={{ fontWeight: 'bold' }} variant="h6">
                {(cpsMetaInfo.data.salesCount || 0).toLocaleString()}
              </Typography>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Typography>클릭수</Typography>
              <Typography style={{ fontWeight: 'bold' }} variant="h6">
                {(cpsMetaInfo.data.clickCount || 0).toLocaleString()}
              </Typography>
            </div>
          </>
        )}

      </div>
    </Paper>
  );
}
