import React from 'react';
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

const initialData = {
  columns: ['날짜', '환불금액', '진행상황'],
  data: [['-', '-', '-']],
};

function RefundHistory(props) {
  const { classes } = props;

  const { payload, loading } = useFetchData('/api/dashboard/marketer/cash/refund/list');
  // 충전 및 환불 페이지네이션

  return (
    <Card>
      <CardHeader color="blueGray">
        <h4 className={classes.cardTitleWhite}>
          환불 처리 내역
        </h4>
      </CardHeader>
      <CardBody>
        <Table
          tableHeaderColor="danger"
          tableHead={initialData.columns}
          tableData={loading ? initialData.data : payload.data}
          pagination
        />
      </CardBody>
    </Card>
  );
}

RefundHistory.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(DashboardStyle)(RefundHistory);
