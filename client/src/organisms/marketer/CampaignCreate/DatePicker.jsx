import 'date-fns';
import React from 'react';
import { Grid, FormControlLabel, Checkbox } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

function MaterialUIPickers(props) {
  // The first commit of Material-UI
  const { dispatch, } = props;
  const todayDate = new Date(`${new Date().toString().split('GMT')[0]} UTC`).toISOString().split('.')[0];
  const [selectedOpenDate, setSelectedOpenDate] = React.useState(new Date(todayDate));
  const [selectedFinDate, setSelectedFinDate] = React.useState(new Date(todayDate));
  const [finOpen, setFinOpen] = React.useState(true);
  const handleOpenDateChange = (date) => {
    dispatch({ key: 'startDate', value: date });
    setSelectedOpenDate(date);
  };
  const handleFinDateChange = (date) => {
    dispatch({ key: 'finDate', value: date });
    setSelectedFinDate(date);
  };
  const handleEndChange = () => {
    setFinOpen(!finOpen);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container>
        <KeyboardDatePicker
          disableToolbar
          disablePast
          variant="inline"
          format="yyyy/MM/dd"
          margin="normal"
          id="start-date-picker"
          label="시작일"
          value={selectedOpenDate}
          onChange={handleOpenDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <KeyboardDatePicker
          disableToolbar
          disablePast
          disabled={finOpen}
          variant="inline"
          format="yyyy/MM/dd"
          margin="normal"
          id="end-date-picker"
          label="종료일"
          value={selectedFinDate}
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


export default MaterialUIPickers;
