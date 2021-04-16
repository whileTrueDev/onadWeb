import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  textField: {
    fontSize: '17px',
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
    [theme.breakpoints.down('xs')]: {
      minWidth: '200px',
      marginRight: 0,
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: 220,
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
    margin: 0,
    marginTop: theme.spacing(3),
    padding: 0,
  },
  switchLabel: { fontSize: theme.typography.caption.fontSize, maxWidth: 40, textAlign: 'center' },
  companyField: {
    [theme.breakpoints.down('xs')]: {
      minWidth: '150px',
      marginRight: 0,
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: 150
    },
  },
  companyNum: {
    marginTop : '16px',
  },
  companySelect : {
    [theme.breakpoints.down('xs')]: {
      minWidth: '100%',
      marginRight: 0,
    },
  }
}));

export default useStyles;
