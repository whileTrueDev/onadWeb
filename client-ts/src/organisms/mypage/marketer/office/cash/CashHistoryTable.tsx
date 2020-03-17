import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// core
import withStyles from '@material-ui/core/styles/withStyles';
// own components
import Card from '../../../../../atoms/Card/Card';
import CardHeader from '../../../../../atoms/Card/CardHeader';
import CardBody from '../../../../../atoms/Card/CardBody';
import Table from '../../../../../atoms/Table/Table';
import DashboardStyle from '../../../../../assets/jss/views/dashboardStyle';
// hooks
import useGetRequest from '../../../../../utils/hooks/useGetRequest';
import axios from '../../../../../utils/axios';
import HOST from '../../../../../utils/config';

const initialData = {
  columns: ['날짜', '충전금액', '결제수단', '진행상황'],
  data: [
    ['-', '-', '-', '-'],
  ],
};

function CashHistory(props: { classes: any }) {
  const { classes } = props;
  const [vbankload, setVbankload] = useState<boolean>(false);

  const { data, loading } = useGetRequest<null, { data: string[][] }>('/marketer/cash/history/charge');

  useEffect(() => {
    axios.post<boolean[]>(`${HOST}/api/dashboard/marketer/cash/vbank`)
      .then((row) => {
        setVbankload(row.data[0]);
      });
  }, [setVbankload, vbankload]);

  return (
    <Card>
      <CardHeader color="blueGray">
        <h4 className={classes.cardTitleWhite}>
          충전 내역
        </h4>
      </CardHeader>
      <CardBody>
        <Table
          tableHeaderColor="info"
          tableHead={initialData.columns}
          tableData={(loading || (data === null)) ? initialData.data : data.data}
          pagination
        />
      </CardBody>


    </Card>
  );
}
export default withStyles(DashboardStyle)(CashHistory);
