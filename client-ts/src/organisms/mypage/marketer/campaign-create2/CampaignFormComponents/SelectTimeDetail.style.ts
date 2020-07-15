import { makeStyles, Theme } from '@material-ui/core/styles';

const SelectTimeDetailUseStyles = makeStyles((theme: Theme) => ({
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
    borderColor: theme.palette.common.black,
    borderStyle: 'solid',
    padding: 'auto',
    width: '45px',
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
