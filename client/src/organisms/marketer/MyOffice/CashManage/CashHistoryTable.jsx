import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
// core
import withStyles from '@material-ui/core/styles/withStyles';
// own components
import Card from '../../../../atoms/Card/Card';
import CardHeader from '../../../../atoms/Card/CardHeader';
import CardBody from '../../../../atoms/Card/CardBody';
import Table from '../../../../atoms/Table/Table';
import DashboardStyle from '../../../../assets/jss/onad/views/dashboardStyle';
// hooks
import useFetchData from '../../../../utils/lib/hooks/useFetchData';
import axios from '../../../../utils/axios';
import HOST from '../../../../utils/config';

const initialData = {
  columns: ['날짜', '충전금액', '결제수단', '진행상황'],
  data: [
    ['-', '-', '-', '-'],
  ],
};

function CashHistory(props) {
  const { classes } = props;
  const [vbankload, setVbankload] = useState(false);

  const { payload, loading } = useFetchData('/api/dashboard/marketer/cash/charge/list');

  useEffect(() => {
    axios.post(`${HOST}/api/dashboard/marketer/cash/vbankCancle`)
      .then((row) => {
        setVbankload(row.data)
      })
  }, [setVbankload, vbankload])

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
          tableData={loading ? initialData.data : payload.data}
          pagination
        />
      </CardBody>


    </Card>
  );
}

CashHistory.propTypes = {
  classes: PropTypes.object
};

export default withStyles(DashboardStyle)(CashHistory);
