import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

const useStyles = makeStyles(theme => ({
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    border: '1px',
    padding: 'auto',
    width: '45px',
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
  const { dispatch } = props;
  const times = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  const defaultList = times.map(() => false);
  const [checkList, setCheckList] = React.useState(defaultList);

  const indices = (arr) => {
    const returnArray = arr.reduce(
      (out, bool, index) => (bool ? out.concat(index) : out),
      []
    );
    return returnArray;
  };

  const onUpdate = index => () => {
    const newCheckList = checkList.map((item, j) => ((j === index) ? !item : item));
    // 출석부가 작성되었으므로 1이 된다.
    setCheckList(newCheckList);
    dispatch({ key: 'time', value: indices(newCheckList) });
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <table className={classes.table}>
          <thead>
            <tr>
              {times.map(index => (<td className={classes.thead} key={index}>{index}</td>))}
            </tr>
          </thead>
          <tbody>
            <tr className={classes.td}>
              {times.map(index => (
                <td className={checkList[index] ? classes.tdCheck : classes.td} key={index} onClick={onUpdate(index)} value={index} role="gridcell" style={{ cursor: 'pointer' }}>
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
export default TimeSelector;
