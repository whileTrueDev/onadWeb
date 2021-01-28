import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  textField: {
    [theme.breakpoints.down('xs')]: {
      minWidth: '200px',
      marginRight: 0,
    },
    [theme.breakpoints.up('sm')]: {
      minWidth: '300px',
      marginRight: '10px',
    },
  },
  phoneField: {
    fontSize: '17px',
    [theme.breakpoints.down('xs')]: {
      minWidth: '200px',
      marginRight: 0,
    },
    [theme.breakpoints.up('sm')]: {
      width: 220,
    },
  },
  divider: {
    width: 2,
    height: 28,
    margin: 2,
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  adornment: {
    fontSize: '20px',
    fontWeight: 900
  },
  switchbox: {
    marginLeft: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switch: {
    '& .MuiFormControlLabel-label': {
      fontSize: '11px',
      color: 'black'
    },
    margin: 0,
    marginTop: theme.spacing(3),
    padding: 0,
  }
}));


export default useStyles;
