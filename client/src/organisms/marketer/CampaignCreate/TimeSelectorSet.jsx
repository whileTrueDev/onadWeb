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
            // onClick={handleTimeSelectorOpen} // 기능 구현 이후 주석 제거
            fontSize="large"
          />
          <StyledSelectText
            // onClick={handleTimeSelectorOpen}
            primary="시간대 설정 없이 계속 집행"
          />
        </Grid>
      </Grid>
      <Grid item>
        {/* ***************** NOTICE ***************** */}
        {/* SOCKET 광고 송출 서버 기능 구현 이후 disabled 삭제 */}

        <Grid container direction="row">
          <GreenCheckbox
            name="set-limit"
            checked={timeSelectorOpen === true}
            // onChange={handleChange}
            // onClick={handleTimeSelectorOpen}
            fontSize="large"
            disabled // 기능 구현 이후 disabled prop 삭제
          />
          <StyledSelectText
            primary="송출 시간대 설정"
            // onClick={handleTimeSelectorOpen} // 기능 구현 이후 주석 제거
            // style={{ cursor: 'pointer' }} // 기능 구현 이후 주석 제거
            secondary="곧 지원 예정입니다."
          />
        </Grid>

        {/* SOCKET 광고 송출 서버 기능 구현 이후 disabled 삭제 */}
        {/* ***************** NOTICE ***************** */}
      </Grid>
    </Grid>
  );
};

export default TimeSelectorSet;
