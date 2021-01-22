import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
// own components
import { Paper } from '@material-ui/core';
import Table from '../../../../../atoms/Table/Table';
// hooks
import useGetRequest from '../../../../../utils/hooks/useGetRequest';
import axios from '../../../../../utils/axios';
import HOST from '../../../../../config';

const initialData = {
  columns: ['날짜', '충전금액', '결제수단', '진행상황'],
  data: [
    ['-', '-', '-', '-'],
  ],
};

function CashHistory(): JSX.Element {
  const [vbankload, setVbankload] = useState<boolean>(false);

  const { data, loading } = useGetRequest<null, { data: string[][] }>('/marketer/cash/history/charge');

  useEffect(() => {
    axios.post<boolean[]>(`${HOST}/marketer/cash/vbank`)
      .then((row) => {
        setVbankload(row.data[0]);
      });
  }, [setVbankload, vbankload]);

  return (
    <Paper style={{ padding: 32, marginTop: 16 }}>
      <Typography style={{ fontWeight: 'bold' }}>
          충전 내역
      </Typography>

      <div>
        <Table
          // tableHeaderColor="info"
          tableHead={initialData.columns}
          tableData={(loading || (data === null)) ? initialData.data : data.data}
          pagination
        />
      </div>


    </Paper>
  );
}
export default CashHistory;
