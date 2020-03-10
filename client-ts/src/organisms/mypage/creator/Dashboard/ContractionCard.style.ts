import { Theme, makeStyles } from '@material-ui/core/styles';

const useContractionStyles = makeStyles((theme: Theme) => ({
  checked: {},
  checkboxRoot: {
    color: theme.palette.success.main,
    '&$checked': {
      color: theme.palette.success.dark,
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
    backgroundColor: theme.palette.background.paper,
    fontSize: 13,
  },
  inDialogContent: {
    padding: theme.spacing(1),
    outline: 'none',
    [theme.breakpoints.down('xs')]: {
      fontWeight: 500,
      fontSize: '10px',
    },
  },
  actionsContainer: {
    marginTop: theme.spacing(1),
    float: 'right',
  },
  termTitle: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
    },
  },
}));
export default useContractionStyles;
