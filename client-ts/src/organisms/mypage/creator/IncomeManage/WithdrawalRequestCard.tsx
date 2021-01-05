import { Button, Paper, Typography } from '@material-ui/core';
import React from 'react';

export interface WithdrawalRequestCardProps {
  handleDialogOpen: () => void;
}
export default function WithdrawalRequestCard({
  handleDialogOpen,
}: WithdrawalRequestCardProps): JSX.Element {
  return (
    <Paper style={{ marginTop: 8, padding: '16px 32px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography style={{ fontWeight: 'bold' }}>
          수익금 출금하기
        </Typography>

        <Button variant="contained" color="primary" onClick={handleDialogOpen}>출금진행</Button>
      </div>
    </Paper>
  );
}
