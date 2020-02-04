import React from 'react';
import {
  Grid
} from '@material-ui/core';

import GreenCheckbox from '../../../atoms/GreenCheckBox';
import StyledSelectText from '../../../atoms/StyledSelectText';

const TimeSelectorSet = (props) => {
  const { timeSelectorOpen, handleTimeSelectorOpen } = props;
  return (
    <Grid container direction="column">
      <Grid item>
        <Grid container direction="row">
          <GreenCheckbox
            name="no-limit"
            checked={timeSelectorOpen === false}
            // onChange={handleChange}
            onClick={handleTimeSelectorOpen}
            fontSize="large"
            // disabled
          />
          <StyledSelectText onClick={handleTimeSelectorOpen} style={{ cursor: 'pointer' }} primary="시간대 설정 없이 계속 진행" />
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <GreenCheckbox
            name="set-limit"
            checked={timeSelectorOpen === true}
            // onChange={handleChange}
            onClick={handleTimeSelectorOpen}
            fontSize="large"
          />
          <StyledSelectText onClick={handleTimeSelectorOpen} style={{ cursor: 'pointer' }} primary="송출 시간대 설정" />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TimeSelectorSet;
