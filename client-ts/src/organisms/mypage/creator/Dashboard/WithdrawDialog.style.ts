import { Theme, makeStyles } from '@material-ui/core/styles';

const useWithdrawDialogStyles = makeStyles((theme: Theme) => ({
  contentTitle: {
    fontWeight: 'bold',
  },
  selectValue: {
    color: '#333',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 250,
    fontSize: 16,
  },
  paper: {
    maxWidth: '1200px',
    width: '1200px',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  button: {
    marginRight: theme.spacing(1),
  },
  end: {
    color: '#fff',
    marginRight: theme.spacing(1),
  },
  title: {
    marginTop: 5,
    paddingBottom: 10,
    fontWeight: 600,
  },
  titleWrap: {
    background: 'linear-gradient(45deg, #FFAA00 30%, #FF8E53 90%)',
    color: 'white',
    textAlign: 'center'
  }
}));

export default useWithdrawDialogStyles;
