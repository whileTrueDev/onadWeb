import React from 'react';
// core
import Typography from '@material-ui/core/Typography';
// own components
import { Paper } from '@material-ui/core';
import Table from '../../../../../atoms/Table/Table';
// hooks
import useGetRequest from '../../../../../utils/hooks/useGetRequest';

const initialData = {
  columns: ['날짜', '환불금액', '진행상황'],
  data: [['-', '-', '-']],
};

function RefundHistory(): JSX.Element {
  const { data, loading } = useGetRequest<null, { data: string[][] }>('/marketer/cash/history/refund');
  // 충전 및 환불 페이지네이션

  return (
    <Paper style={{ padding: 32, marginTop: 16 }}>
      <Typography style={{ fontWeight: 'bold' }}>
          환불 처리 내역
      </Typography>
      <div>
        <Table
          // tableHeaderColor="danger"
          tableHead={initialData.columns}
          tableData={(loading || (data === null)) ? initialData.data : data.data}
          pagination
        />
      </div>
    </Paper>
  );
}

export default RefundHistory;
