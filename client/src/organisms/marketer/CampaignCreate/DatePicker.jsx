import 'date-fns';
import React from 'react';
import { Grid, FormControlLabel, Checkbox } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import PropTypes from 'prop-types';


function MaterialUIPickers(props) {
  // The first commit of Material-UI
  const { state, dispatch } = props;
  const [finOpen, setFinOpen] = React.useState(true);

  const handleOpenDateChange = (date) => {
    dispatch({ key: 'startDate', value: date });
  };

  const handleFinDateChange = (date) => {
    dispatch({ key: 'finDate', value: date });
  };

  const handleEndChange = () => {
    setFinOpen(!finOpen);
    dispatch({ key: 'finDate', value: null });
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container>
        <KeyboardDatePicker
          autoOk
          disablePast
          variant="inline"
          format="yyyy/MM/dd"
          margin="normal"
          id="start-date-picker"
          label="시작일"
          minDate={state.startDate}
          value={state.startDate}
          onChange={handleOpenDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <KeyboardDatePicker
          autoOk
          disablePast
          disabled={finOpen}
          variant="inline"
          format="yyyy/MM/dd"
          margin="normal"
          id="end-date-picker"
          label="종료일"
          minDate={state.startDate}
          value={state.finDate}
          onChange={handleFinDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <FormControlLabel
          control={(
            <Checkbox
              color="primary"
              checked={finOpen}
              onChange={handleEndChange}
              fontSize="small"
              style={{ padding: '3px' }}
            />
                  )}
          label="종료일 미설정"
          labelPlacement="start"
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}


/**
 * @description
  해당 캠페인의 기간을 선택하는 컴포넌트

 * @param {*} state ? 기간을 저장하는 object
 * @param {*} dispatch ? 기간을 변경하는 func

 * @author 박찬우
 */
MaterialUIPickers.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default MaterialUIPickers;
