import { Button, Paper, Typography } from '@material-ui/core';
import { useCreatorIncome } from '../../../../utils/hooks/query/useCreatorIncome';

export interface WithdrawalRequestCardProps {
  handleDialogOpen: () => void;
}
export default function WithdrawalRequestCard({
  handleDialogOpen,
}: WithdrawalRequestCardProps): JSX.Element {
  const income = useCreatorIncome();

  if (income.isLoading) return <div />;
  if (income.data && !(income.data.creatorReceivable > 0)) return <div />;
  return (
    <Paper style={{ marginTop: 8, padding: '16px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography style={{ fontWeight: 'bold' }}>수익금 출금하기</Typography>

        <Button variant="contained" color="primary" onClick={handleDialogOpen}>
          출금진행
        </Button>
      </div>
    </Paper>
  );
}
