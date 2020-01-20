import React, { useState } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '../../../atoms/Card/Card';
import CardHeader from '../../../atoms/Card/CardHeader';
import CardBody from '../../../atoms/Card/CardBody';
import BannerTable from './sub/BannerTable';
import useFetchData from '../../../utils/lib/hooks/useFetchData';
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import CircularProgress from '../../../atoms/Progress/CircularProgress';
import BanCheckDialog from './sub/BanCheckDialog';

const BannerTableCard = (props) => {
  const { classes } = props;
  const [campaign, setCampaign] = useState({ bannerSrc: '' });
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const tableData = useFetchData('/api/dashboard/creator/banner/list');
  return (
    <Card>
      <CardHeader color="blueGray">
        <h4 className={classes.cardTitleWhite}>배너 내역</h4>
      </CardHeader>
      <CardBody>
        {tableData.loading && (<CircularProgress small />)}
        {!tableData.loading && !tableData.error && (
          <BannerTable tableData={tableData.payload} setOpen={setOpen} setCampaign={setCampaign} />
        )}
        <BanCheckDialog open={open} handleClose={handleClose} campaign={campaign} />
      </CardBody>
    </Card>
  );
};

export default withStyles(dashboardStyle)(BannerTableCard);
