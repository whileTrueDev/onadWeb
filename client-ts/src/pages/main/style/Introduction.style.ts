import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  rootWrap: {
    background: 'url(\'/pngs/introduction/marketerIntroduce.png\') no-repeat center center',
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
      height: '450px'
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
    wordBreak: 'keep-all',
    fontSize: 40,
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
  maintopCenterVideo: {
    width: '750px',
    height: '500px',
  },
  buttonLeft: {
    width: '40%',
    backgroundColor: '#3154EB',
    borderRadius: '5px',
    fontSize: 20,
    marginRight: 20,
  },
  buttonRight: {
    width: '40%',
    borderRadius: '5px',
    border: '1px solid #3154EB',
    fontSize: 20,
  }
}));

export default styles;
