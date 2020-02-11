import React from 'react';
import {
  Grid
} from '@material-ui/core';

import GreenCheckbox from '../../../atoms/GreenCheckBox';
import StyledSelectText from '../../../atoms/StyledSelectText';

const CampaignTimeSet = (props) => {
  const {
    handleDateOpen,
    dateOpen
  } = props;
  return (
    <Grid container direction="column">
      <Grid item>
        <Grid container direction="row">
          <GreenCheckbox
            name="no-limit"
            checked={dateOpen === false}
            onClick={handleDateOpen}
            fontSize="large"
          />
          <StyledSelectText
            onClick={handleDateOpen}
            primary="승인일부터 종료일 없이 계속 집행"
          />
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <GreenCheckbox
            name="set-limit"
            checked={dateOpen === true}
            onClick={handleDateOpen}
            fontSize="large"
          />
          <StyledSelectText
            primary="시작일 또는 종료일 설정"
            onClick={handleDateOpen}
            style={{ cursor: 'pointer' }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CampaignTimeSet;
