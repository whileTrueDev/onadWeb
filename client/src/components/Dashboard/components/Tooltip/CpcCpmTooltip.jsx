import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

const CpcCpmTooltip = ({ value }) => (
  <Tooltip
    placement="right"
    title={(
      <React.Fragment>
        <span>CPM :</span>
        <br />
        <span>CPC :</span>
      </React.Fragment>
                          )}
  >
    <span>{value}</span>
  </Tooltip>
);

export default CpcCpmTooltip;
