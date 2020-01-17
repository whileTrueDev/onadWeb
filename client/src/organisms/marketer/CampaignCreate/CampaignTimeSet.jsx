import React from 'react';
import {
  Grid
} from '@material-ui/core';

import GreenCheckbox from '../../../atoms/GreenCheckBox';
import StyledSelectText from '../../../atoms/StyledSelectText';

const CampaignTimeSet = (props) => {
  const { classes, handleDateOpen, dateOpen } = props;
  return (
    <Grid container direction="column">
      <Grid item>
        <Grid container direction="row">
          <GreenCheckbox
            name="no-limit"
            checked={dateOpen === false}
            // onChange={handleChange}
            onClick={handleDateOpen}
            fontSize="large"
            // disabled
          />
          <StyledSelectText onClick={handleDateOpen} style={{ cursor: 'pointer' }} primary="승인일부터 종료일 없이 계속 진행" />
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <GreenCheckbox
            name="set-limit"
            checked={dateOpen === true}
            // onChange={handleChange}
            onClick={handleDateOpen}
            fontSize="large"
          />
          <StyledSelectText onClick={handleDateOpen} style={{ cursor: 'pointer' }} primary="시작일 또는 종료일 설정" />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CampaignTimeSet;
