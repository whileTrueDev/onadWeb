import React from 'react';
// core
import Typography from '@material-ui/core/Typography';
import { Paper } from '@material-ui/core';
import Table from '../../../../atoms/Table/Table';
// hooks
import useGetRequest from '../../../../utils/hooks/useGetRequest';

const initialData = {
  columns: ['날짜', '금액', '발행상태'],
  data: [['-', '-', '-']]
};

export default function TaxBill(): JSX.Element {
  const { data, loading } = useGetRequest<null, string[][]>('/marketer/tax-bills');


  return (
    <Paper style={{ padding: 32, marginTop: 8 }}>
      <Typography style={{ fontWeight: 'bold' }}>
          세금계산서 발행 내역
      </Typography>
      <div>
        <Table
          // tableHeaderColor="danger"
          tableHead={initialData.columns}
          tableData={loading || data === null ? initialData.data : data}
          pagination
        />
      </div>
    </Paper>
  );
}
