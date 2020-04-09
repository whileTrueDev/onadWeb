import React from 'react';
// core
import Typography from '@material-ui/core/Typography';
import Card from '../../../../atoms/Card/Card';
import CardHeader from '../../../../atoms/Card/CardHeader';
import CardBody from '../../../../atoms/Card/CardBody';
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
    <Card>
      <CardHeader color="blueGray">
        <Typography variant="h6">
          세금계산서 발행 내역
        </Typography>
      </CardHeader>
      <CardBody>
        <Table
          // tableHeaderColor="danger"
          tableHead={initialData.columns}
          tableData={loading || data === null ? initialData.data : data}
          pagination
        />
      </CardBody>
    </Card>
  );
}
