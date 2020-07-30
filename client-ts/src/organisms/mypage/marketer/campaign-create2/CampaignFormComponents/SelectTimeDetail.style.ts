import { makeStyles, Theme } from '@material-ui/core/styles';

const SelectTimeDetailUseStyles = makeStyles((theme: Theme) => ({
  table: { width: '960px', borderCollapse: 'collapse' },
  legend: {
    display: 'flex', marginTop: theme.spacing(2), justifyContent: 'center', width: 960
  },
  legendItem: {
    height: 20, width: 60, marginLeft: theme.spacing(1), marginRight: theme.spacing(1),
  },
  legendItemOn: { backgroundColor: theme.palette.primary.main, },
  legendItemOff: { backgroundColor: theme.palette.action.disabled, },
  thead: {
    border: '1px',
    padding: 'auto',
    width: '40px',
    textAlign: 'center'
  },
  td: {
    border: '1px',
    borderColor: theme.palette.common.black,
    borderStyle: 'solid',
    padding: 'auto',
    textAlign: 'center',
    height: '3px',
    backgroundColor: theme.palette.action.disabled,
  },
  tdCheck: {
    backgroundColor: theme.palette.primary.main,
  },
  font: { opacity: '0' }
}));

export default SelectTimeDetailUseStyles;
