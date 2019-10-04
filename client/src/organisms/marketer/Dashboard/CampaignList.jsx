import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import Table from './sub/CampaignTable';
import Button from '../../../atoms/CustomButtons/Button';
import CircularProgress from '../../../atoms/Progress/CircularProgress';

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

export default function CampaignTable(props) {
  const classes = useStyles();
  const { campaignData } = props;
  function handleCreateCampaign() {
    console.log('캠페인 생성 클릭');
  }

  return (
    <div>
      <div>
        <Button color="info" onClick={handleCreateCampaign}>
          <Add />
            새 캠페인 등록하기
        </Button>
      </div>
      {campaignData.loading && (
        <div className={classes.flex} style={{ height: 200 }}><CircularProgress small /></div>
      )}
      {!campaignData.loading && !campaignData.error && campaignData.payload && (
        <Table
          dataSet={campaignData.payload.data}
        />
      )}

      {!campaignData.loading && campaignData.error && !campaignData.payload && (
      <div style={{ marginBottom: 55, marginTop: 55 }}>
        <div className={classes.flex}>
          <Typography>등록된 캠페인이 없습니다.</Typography>
        </div>
        <div className={classes.flex}>
          <Typography
            className={classes.clickable}
            onClick={handleCreateCampaign}
          >
              새 캠페인 등록하기
          </Typography>
          <Typography>&emsp;를 클릭하여 새로운 캠페인을 시작하세요.</Typography>
        </div>
      </div>
      )}
    </div>
  );
}

CampaignTable.propTypes = {
  campaignData: PropTypes.object
};
