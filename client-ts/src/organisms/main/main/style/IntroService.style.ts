import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: 'white',
    width: '100%',
    height: '400px',
    color: 'black',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10%'
  },
  wrapper: {
    width: '100%',
    padding: '0px 60px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 600,
    fontFamily: 'Noto sans KR',
    wordBreak: 'keep-all',
    marginTop: 10,
    [theme.breakpoints.down('md')]: {
      fontSize: 30,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 25,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 23,
      textAlign: 'center'
    },
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
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      width: 190,
      fontSize: 18,
    },
    [theme.breakpoints.down('sm')]: {
      width: 180,
      fontSize: 18,
    },
    [theme.breakpoints.down('xs')]: {
      width: 140,
      fontSize: 14,
    },
  },
  down: {
    color: 'white'
  },
  subtitle: {
    fontWeight: 600,
    fontFamily: 'Noto sans KR',
    marginBottom: 30,
    wordBreak: 'keep-all',
    marginTop: 10,
    [theme.breakpoints.down('md')]: {
      fontSize: 24,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 22,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 20,
      textAlign: 'center'
    },
  }
}));

export default useStyles;
