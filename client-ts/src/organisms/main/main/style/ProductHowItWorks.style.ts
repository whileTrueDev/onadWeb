import makeStyles from '@material-ui/core/styles/makeStyles';
import grey from '@material-ui/core/colors/grey';

const styles = makeStyles((theme) => ({
  root: {
    backgroundColor: grey[100],
    marginBottom: theme.spacing(8),
    padding: '80px 0px',
    [theme.breakpoints.down('sm')]: {
      padding: '4px 0px',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '30px 0px',
    },
  },
  bottomSpace: {
    marginBottom: theme.spacing(8),
    marginTop: 12,
    fontFamily: 'Noto Sans KR',
    fontSize: 22,
    [theme.breakpoints.down('md')]: {
      fontSize: 20,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 18,
      wordBreak: 'keep-all',
      textAlign: 'center',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
      wordBreak: 'keep-all',
      textAlign: 'center',
    },
  },
  mainBottom: {
    display: 'flex',
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(10),
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(8),
      justifyContent: 'center'
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(6),
      justifyContent: 'center'
    },
  },
  mainBottomtitle: {
    fontSize: 48,
    fontFamily: 'Noto Sans Kr',
    fontWeight: 600,
    [theme.breakpoints.down('md')]: {
      fontSize: 40,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 30,
      wordBreak: 'keep-all',
      textAlign: 'center'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 20,
      wordBreak: 'keep-all',
      textAlign: 'center'
    },
  },
  bottomText: {
    fontFamily: 'Noto Sans KR',
    fontSize: 22,
    [theme.breakpoints.down('md')]: {
      fontSize: 20,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 18,
      wordBreak: 'keep-all',
      textAlign: 'center',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
      wordBreak: 'keep-all',
      textAlign: 'center',
    },
  },
  bottomButtom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'left',
    alignItems: 'center',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    },
  },
  mainBottomImg: {
    width: '650px',
    height: '440px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    wordBreak: 'keep-all',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 200,
    height: 60,
    fontSize: 20,
    fontFamily: 'Noto sans KR',
    fontWeight: 500,
    color: 'white',
    margin: 20,
    borderRadius: 5,
    wordBreak: 'keep-all',
    backgroundColor: '#3154EB',
    [theme.breakpoints.down('md')]: {
      width: 190,
      fontSize: 18,
    },
    [theme.breakpoints.down('sm')]: {
      width: 180,
      fontSize: 18,
    },
    [theme.breakpoints.down('sm')]: {
      margin: 10,
      width: 140,
      fontSize: 14,
    },
  }
}));

export default styles;
