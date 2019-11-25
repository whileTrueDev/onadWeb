import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core';
import Table from './sub/CampaignTable';
import Button from '../../../atoms/CustomButtons/Button';
import CircularProgress from '../../../atoms/Progress/CircularProgress';
import Card from '../../../atoms/Card/Card';
import CardHeader from '../../../atoms/Card/CardHeader';
import CardBody from '../../../atoms/Card/CardBody';
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';

const useStyles = makeStyles(() => ({
  flex: {
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  },
  clickable: {
    color: '#00acc1',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}));

function CampaignTable(props) {
  const { classes, handleCampaignCreateMode } = props;
  const classes1 = useStyles();
  const { campaignData, bannerData } = props;

  return (

    <Card>
      <CardHeader color="blueGray">
        <h4 className={classes.cardTitleWhite}>캠페인 내역</h4>
      </CardHeader>
      <CardBody>
        {!bannerData.loading && !bannerData.error && bannerData.payload.length > 0 && (
        <div>
          <Button
            color="info"
            onClick={() => { handleCampaignCreateMode(); }
            }
          >
            <Add />
            새 캠페인 등록
          </Button>
        </div>
        )}
        {campaignData.loading && (
        <div className={classes1.flex} style={{ height: 200 }}><CircularProgress small /></div>
        )}
        {!campaignData.loading && !campaignData.error && campaignData.payload && (
        <Table dataSet={campaignData.payload.data} />
        )}

        {!campaignData.loading && campaignData.error && !campaignData.payload && (
        <div style={{ marginBottom: 55, marginTop: 55 }}>
          <div className={classes1.flex}>
            <Typography>등록된 캠페인이 없습니다.</Typography>
          </div>
          <div className={classes1.flex}>
            <Typography
              className={classes1.clickable}
              onClick={handleCampaignCreateMode}
            >
              새 캠페인 등록하기
            </Typography>
            <Typography>&emsp;를 클릭하여 새로운 캠페인을 시작하세요.</Typography>
          </div>
        </div>
        )}
      </CardBody>
    </Card>

  );
}

CampaignTable.propTypes = {
  campaignData: PropTypes.object,
  handleCampaignCreateMode: PropTypes.func.isRequired
};

export default withStyles(dashboardStyle)(CampaignTable);
