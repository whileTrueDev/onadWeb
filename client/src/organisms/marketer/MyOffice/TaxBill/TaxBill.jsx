import React from 'react';
// core
import Card from '../../../../atoms/Card/Card';
import CardHeader from '../../../../atoms/Card/CardHeader';
import CardBody from '../../../../atoms/Card/CardBody';
import Table from '../../../../atoms/Table/Table';
// own component
// import NoTaxBillTolltip from '../../../../atoms/Tooltip/NoTaxBillTooltip';
// hooks
import useFetchData from '../../../../utils/lib/hooks/useFetchData';

const initialData = {
  columns: ['날짜', '금액', '발행상태'],
  data: [['-', '-', '-']]
};

export default function TaxBill() {
  const { payload, loading } = useFetchData('/api/dashboard/marketer/profile/taxbill');

  return (
    <Card>
      <CardHeader color="blueGray">
        <h4>
          환불 처리 내역
        </h4>
      </CardHeader>
      <CardBody>
        <Table
          tableHeaderColor="danger"
          tableHead={initialData.columns}
          tableData={loading ? initialData.data : payload}
          pagination
        />
      </CardBody>
    </Card>
  );
}
