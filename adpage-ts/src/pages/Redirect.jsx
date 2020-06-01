import React from 'react';
import Typography from '@material-ui/core/Typography';

const Redirect = (props) => {
  const { match } = props;
  return (
    <React.Fragment>
      {match.params.name === 'http'
        ? (<meta httpEquiv="refresh" content="0;url=http://track.shallweadcorp.com/track/cox3/1853179970/986322556?sub_param1=ap_a6454_4490c7_c4f350d3cc87d17bd06bbedfe7cba291&aff_id=4490c7" />)
        : (<meta httpEquiv="refresh" content="0;url=https://play.google.com/store/apps/details?id=com.fourdesire.plantnanny2" />)
    }
      <Typography>
        redirecting...
      </Typography>
    </React.Fragment>
  );
};

export default Redirect;
