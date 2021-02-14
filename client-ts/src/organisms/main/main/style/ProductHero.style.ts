import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  mainTitle: {
    fontWeight: 700, 
  },
  loginButton: {
    width: 250,
    height: 50,
    borderRadius: 30,
    fontSize: 20,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.common.white,
    background: 'linear-gradient(to right, #3589fc, #0dd0ff)',
    marginTop: theme.spacing(3)
  },
  loginButton2: {
    width: 250,
    height: 50,
    borderRadius: 30,
    fontSize: 20,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.common.white,
    background: 'linear-gradient(to right, #54eacd, #5ed7ed)',
    marginTop: theme.spacing(3)
  }
}));

export default styles;
