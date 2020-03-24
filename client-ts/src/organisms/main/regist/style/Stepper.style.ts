import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
    [theme.breakpoints.up('md')]: {
      width: '75%',
    },
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(5),
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(1) * 3,
  },
}));

export default useStyles;
