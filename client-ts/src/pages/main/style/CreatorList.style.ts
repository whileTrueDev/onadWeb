import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'url(\'/pngs/main/loading.gif\') no-repeat center center',
    backgroundSize: 'cover',
    width: '100%',
    height: '700px',
    [theme.breakpoints.down('md')]: {
      height: '600px',
    },
    [theme.breakpoints.down('sm')]: {
      height: '500px'
    },
    [theme.breakpoints.down('xs')]: {
      height: '600px'
    }
  },
  containerWrap: {
    backgroundColor: 'rgb(0,0,0, 0.6)',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginMiddle: {
    color: 'white',
    textAlign: 'left',
    width: '50%',
    fontSize: '20px',
    fontFamily: 'Noto Sans KR',
    marginRight: 30,
  },
  h1: {
    marginTop: '10px',
    marginBottom: '5px',
    fontSize: 45,
    fontWeight: 600,
    [theme.breakpoints.down('md')]: {
      fontSize: 35,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 27,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 25,
    },
  },
  h1sub: {
    marginTop: 40,
    marginBottom: 40,
    [theme.breakpoints.down('md')]: {
      fontSize: 18,
      marginTop: 35,
      marginBottom: 35,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 15,
      marginTop: 30,
      marginBottom: 30,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      marginTop: 20,
      marginBottom: 20,
    },
  },
  maintop: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainList: {
    padding: '80px 10%'
  },
  listWrapper: {
    padding: 20,
  },
  cardTitle: {
    fontFamily: 'S-CoreDream-8Heavy',
    fontSize: 22,
    margin: 0
  },
  liveTitle: {
    fontFamily: 'S-CoreDream-8Heavy',
    fontSize: 22,
    margin: 0,
    background: 'red',
    color: 'white'
  },
  live: {
    borderRadius: '10px',
    height: 200,
    boxShadow: '0px 0px 15px 3px red',
    '&:hover': {
      boxShadow: '0px 0px 30px 5px red'
    }
  },
  notlive: {
    borderRadius: '10px',
    height: 200,
    boxShadow: '0px 0px 15px 0px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      boxShadow: '0px 0px 30px 5px rgba(0, 0, 255, 0.7)'
    }
  },
  loadingTitle: {
    fontFamily: 'Noto Sans KR',
    fontSize: 40,
    fontWeight: 580
  }
}));

export default useStyles;
