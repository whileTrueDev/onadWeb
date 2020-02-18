import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import PropTypes from 'prop-types';


const useStyles = makeStyles(theme => ({
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    border: '1px',
    padding: 'auto',
    width: '40px',
    textAlign: 'center'
  },
  td: {
    border: '1px',
    borderColor: '#444444',
    borderStyle: 'solid',
    padding: 'auto',
    width: '45px',
    textAlign: 'center',
    height: '3px'
  },
  tdCheck: {
    border: '1px',
    borderColor: '#444444',
    borderStyle: 'solid',
    padding: 'auto',
    backgroundColor: '#00acc1',
    width: '45px',
    height: '3px'
  },
  font: { opacity: '0' }
}));
const TimeSelector = (props) => {
  const classes = useStyles();
  const {
    state, dispatch
  } = props;
  const times = [...Array(24).keys()];

  const onUpdate = index => () => {
    const newcheckState = state.timeList.map((item, j) => ((j === index) ? !item : item));
    dispatch({ key: 'settime', value: newcheckState });
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <table className={classes.table}>
          <thead>
            <tr>
              {times.map(index => (<td className={classes.thead} key={index}>{`${index}시`}</td>))}
            </tr>
          </thead>
          <tbody>
            <tr className={classes.td}>
              {times.map(index => (
                <td
                  className={state.timeList[index] ? classes.tdCheck : classes.td}
                  key={index}
                  onClick={onUpdate(index)}
                  value={index}
                  role="gridcell"
                  style={{ cursor: 'pointer' }}
                >
                  <span className={classes.font}>
                    {index}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </Grid>
    </MuiPickersUtilsProvider>
  );
};

/**
 * @description
  해당 캠페인의 시간대를 변경하는 컴포넌트

 * @param {*} state ? 시간대를 저장하는 object
 * @param {*} dispatch ? 시간대를 변경하는 func

 * @author 박찬우
 */
TimeSelector.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default TimeSelector;
