import { CircularProgress, Paper, Typography } from '@material-ui/core';
import * as React from 'react';
import { useCreatorCPS } from '../../../../../utils/hooks/query/useCreatorCps';

export default function CPSMetaInfo(): React.ReactElement {
  const cpsMetaInfo = useCreatorCPS();
  return (
    <Paper style={{ padding: 32, marginTop: 8, minHeight: 60 }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        {cpsMetaInfo.isLoading && <CircularProgress />}
        {!cpsMetaInfo.isLoading && cpsMetaInfo.data && (
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
