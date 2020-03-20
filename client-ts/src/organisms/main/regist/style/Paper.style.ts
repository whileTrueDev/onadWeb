import makeStyles from '@material-ui/core/styles/makeStyles';
import green from '@material-ui/core/colors/green';

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  checked: {},
  checkboxRoot: {
    color: green[600],
    '&$checked': {
      color: green[500],
    },
  },
  divider: {
    width: 2,
    height: 28,
    margin: 10,
  },
  container: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
    display: 'flex',
    backgroundColor: '#f2f2f2',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 13,
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  inDialogContent: {
    outline: 'none',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2),
    },
  },
  names: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
      fontWeight: 500,
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: '12px',
      fontWeight: 700,
    },
  },
  end: {
    fontSize: '12px'
  },
  buttonStyle: {
    flex: 1,
    backgroundColor: '#d6d6d6',
    height: '70%',
    fontSize: 13,
  }
}));

export default useStyles;
