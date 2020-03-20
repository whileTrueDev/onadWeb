import { makeStyles, Theme } from '@material-ui/core/styles';

const useContractStyles = makeStyles((theme: Theme) => ({
  container: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    fontSize: 13,
  },
  inDialogContent: {
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    marginLeft: 0,
    marginRight: 0,
    outline: 'none',
    [theme.breakpoints.down('xs')]: {
      fontWeight: 500,
      fontSize: '10px',
    },
  },
  termTitle: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
    },
  },
  dialogTitle: {
    color: theme.palette.text.primary,
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: 300,
    marginBottom: '3px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
    },
  },
}));

export default useContractStyles;
