import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

export default function AdProfile(props) {
  const { campaignData, bannerData } = props;
  return (
    <div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}
      >
        <Typography variant="body1">등록된 배너&emsp; </Typography>
        {!bannerData.loading && bannerData.payload ? (
          <Typography variant="h6">
            {` ${bannerData.payload.length}`}
          </Typography>
        ) : (
          <Typography variant="h6">
          0
          </Typography>
        )}
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}
      >
        <Typography variant="body1">등록된 캠페인&emsp;</Typography>
        {!campaignData.loading && campaignData.payload ? (
          <Typography variant="h6">
            {` ${campaignData.payload.data.length}`}
          </Typography>
        ) : (
          <Typography variant="h6">
          0
          </Typography>
        )}
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}
      >
        <Typography variant="body1">진행중 캠페인&emsp;</Typography>
        {!campaignData.loading && campaignData.payload ? (
          <Typography variant="h6">
            {` ${campaignData.payload.data.filter(camp => camp.onOff === 1).length}`}
          </Typography>
        ) : (
          <Typography variant="h6">
            0
          </Typography>
        )}
      </div>

    </div>
  );
}
AdProfile.propTypes = {
  campaignData: PropTypes.object,
  bannerData: PropTypes.object
};

AdProfile.defaultProps = {
  campaignData: { loading: false, payload: [] },
  bannerData: { loading: false, payload: [] }
};
