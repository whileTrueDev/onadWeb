import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
// own components
import Card from '../../../../../atoms/Card/Card';
import CardHeader from '../../../../../atoms/Card/CardHeader';
import CardBody from '../../../../../atoms/Card/CardBody';
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
    <Card>
      <CardHeader color="blueGray">
        <Typography variant="h6" style={{ textAlign: 'center', }}>
          충전 내역
        </Typography>
      </CardHeader>

      <CardBody>
        <Table
          // tableHeaderColor="info"
          tableHead={initialData.columns}
          tableData={(loading || (data === null)) ? initialData.data : data.data}
          pagination
        />
      </CardBody>


    </Card>
  );
}
export default CashHistory;
