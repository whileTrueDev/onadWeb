import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '../../../atoms/Card/Card';
import CardHeader from '../../../atoms/Card/CardHeader';
import CardBody from '../../../atoms/Card/CardBody';
import BannerTable from './sub/BannerTable';
import useFetchData from '../../../utils/lib/hooks/useFetchData';
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import CircularProgress from '../../../atoms/Progress/CircularProgress';

const BannerTableCard = (props) => {
  const { classes } = props;
  const tableData = useFetchData('/api/dashboard/creator/banner/list');
  return (
    <Card>
      <CardHeader color="blueGray">
        <h4 className={classes.cardTitleWhite}>배너 내역</h4>
      </CardHeader>
      <CardBody>
        {tableData.loading && (<CircularProgress small />)}
        {!tableData.loading && !tableData.error && (
          <BannerTable tableData={tableData.payload} />
        )}
      </CardBody>
    </Card>
  );
};

export default withStyles(dashboardStyle)(BannerTableCard);
