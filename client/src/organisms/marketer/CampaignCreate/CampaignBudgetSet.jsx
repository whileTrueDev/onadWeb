import React from 'react';
import {
  Grid,
} from '@material-ui/core';

import GreenCheckbox from '../../../atoms/GreenCheckBox';
import StyledSelectText from '../../../atoms/StyledSelectText';

const CampaignBudgetSet = (props) => {
  const {
    handleDetailOpen, detailOpen,
  } = props;
  return (
    <Grid container direction="column">
      <Grid item>
        <Grid container direction="row">
          <GreenCheckbox
            name="no-limit"
            checked={detailOpen === false}
            // onChange={handleChange}
            onClick={handleDetailOpen}
            fontSize="large"
            // disabled
          />
          <StyledSelectText onClick={handleDetailOpen} style={{ cursor: 'pointer' }} primary="일예산제한 없이 계속 집행" />
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <GreenCheckbox
            name="set-limit"
            checked={detailOpen === true}
            // onChange={handleChange}
            onClick={handleDetailOpen}
            fontSize="large"
          />
          <StyledSelectText
            onClick={handleDetailOpen}
            style={{ cursor: 'pointer' }}
            primary="일예산 설정"
            secondary="최소금액(5000원 이상)"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CampaignBudgetSet;
