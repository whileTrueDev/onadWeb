import React from 'react';
import {
  Grid
} from '@material-ui/core';

import GreenCheckbox from '../../../atoms/GreenCheckBox';
import StyledSelectText from '../../../atoms/StyledSelectText';

const CampaignTimeSet = (props) => {
  const { handleDateOpen, dateOpen } = props;
  return (
    <Grid container direction="column">
      <Grid item>
        <Grid container direction="row">
          <GreenCheckbox
            name="no-limit"
            checked={dateOpen === false}
            // onClick={handleDateOpen}
            fontSize="large"
            // disabled
          />
          <StyledSelectText
            // onClick={handleDateOpen}
            primary="승인일부터 종료일 없이 계속 집행"
          />
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          {/* ***************** NOTICE ***************** */}
          {/* SOCKET 광고 송출 서버 기능 구현 이후 disabled 삭제 */}
          <GreenCheckbox
            name="set-limit"
            checked={dateOpen === true}
            // onClick={handleDateOpen}
            fontSize="large"
            disabled // 기능 구현이후 disabled prop 삭제
          />
          <StyledSelectText
            primary="시작일 또는 종료일 설정"
            // onClick={handleDateOpen} // 기능 구현 이후 주석 제거
            // style={{ cursor: 'pointer' }} // 기능 구현 이후 주석 제거
            secondary="곧 지원 예정입니다." // 기능 구현 이후 삭제
          />
          {/* SOCKET 광고 송출 서버 기능 구현 이후 disabled 삭제 */}
          {/* ***************** NOTICE ***************** */}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CampaignTimeSet;
