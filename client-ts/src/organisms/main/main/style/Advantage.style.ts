import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
  },
  loginButtonRight: {
    color: 'black',
    textAlign: 'left',
    width: '20%',
    fontSize: '20px',
    fontFamily: 'Noto Sans KR',
    wordBreak: 'keep-all',
    marginLeft: 40,
    [theme.breakpoints.down('md')]: {
      width: '40%',
      marginLeft: 0,
      textAlign: 'left',
    },
    [theme.breakpoints.down('sm')]: {
      width: '40%',
      marginLeft: 0,
      textAlign: 'left',
    },
    [theme.breakpoints.down('xs')]: {
      width: '80%',
      marginLeft: 0,
      textAlign: 'left',
    },
  },
  h1: {
    marginTop: '0px',
    marginBottom: '5px',
    fontSize: 45,
    wordBreak: 'keep-all',
    fontWeight: 500,
    [theme.breakpoints.down('md')]: {
      fontSize: '30px',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '25px',
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: 20,
      fontSize: '20px',
    },
    color: 'black',
    fontFamily: 'Noto Sans KR',
  },
  h2: {
    marginTop: '5px',
    marginBottom: '20px',
    fontSize: 45,
    fontWeight: 600,
    color: 'black',
    fontFamily: 'Noto Sans KR',
    wordBreak: 'keep-all',
    [theme.breakpoints.down('md')]: {
      fontSize: 30,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 25,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 23,
    },
  },
  h1sub: {
    marginTop: 40,
    marginBottom: 40,
    color: 'black',
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.down('md')]: {
      margin: '30px 0px'
    },
    [theme.breakpoints.down('sm')]: {
      margin: '20px 0px'
    },
    [theme.breakpoints.down('sm')]: {
      margin: '20px 0px'
    },
  },
  mainMiddle: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10),
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  mainMiddleimg: {
    position: 'relative',
    width: '500px',
    height: '280px',
    margin: '20px 0px',
    '&>*': {
      transition: 'all 1.5s ease',
    },
    [theme.breakpoints.down('md')]: {
      width: '400px',
      height: '240px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '300px',
      height: '170px',
    },
    [theme.breakpoints.down('xs')]: {
      width: '300px',
      height: '180px',
    },
  },
  mainMiddleCon1: {
    margin: 0,
    position: 'absolute',
    top: '30%',
    left: 0,
    zIndex: 30,
    width: 200,
    height: 100,
    backgroundColor: 'white',
    borderRadius: '50px',
    boxShadow: '0px 0px 5px 2px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      width: 160,
      height: 80,
      borderRadius: '40px',
    },
    [theme.breakpoints.down('sm')]: {
      width: 120,
      height: 70,
      borderRadius: '35px',
    },
    [theme.breakpoints.down('xs')]: {
      width: 100,
      height: 60,
      borderRadius: '30px',
    },
  },
  mainMiddleCon2: {
    margin: 0,
    position: 'absolute',
    top: '30%',
    left: 0,
    zIndex: 20,
    width: 200,
    height: 100,
    backgroundColor: 'white',
    borderRadius: '50px',
    boxShadow: '0px 0px 5px 2px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      width: 160,
      height: 80,
      borderRadius: '40px',
    },
    [theme.breakpoints.down('sm')]: {
      width: 120,
      height: 70,
      borderRadius: '35px',
    },
    [theme.breakpoints.down('xs')]: {
      width: 100,
      height: 60,
      borderRadius: '30px',
    },
  },
  mainMiddleCon3: {
    margin: 0,
    position: 'absolute',
    top: '30%',
    left: 0,
    zIndex: 10,
    width: 200,
    height: 100,
    backgroundColor: 'white',
    borderRadius: '50px',
    boxShadow: '0px 0px 5px 2px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      width: 160,
      height: 80,
      borderRadius: '40px',
    },
    [theme.breakpoints.down('sm')]: {
      width: 120,
      height: 70,
      borderRadius: '35px',
    },
    [theme.breakpoints.down('xs')]: {
      width: 100,
      height: 60,
      borderRadius: '30px',
    },
  },
  duplicate2: {
    margin: 0,
    position: 'absolute',
    top: '30%',
    left: 150,
    zIndex: 10,
    width: 300,
    height: 100,
    backgroundColor: 'white',
    borderRadius: '50px',
    boxShadow: '0px 0px 5px 2px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      left: 120,
      width: 240,
      height: 80,
      borderRadius: '40px',
    },
    [theme.breakpoints.down('sm')]: {
      left: 100,
      width: 160,
      height: 70,
      borderRadius: '35px',
    },
    [theme.breakpoints.down('xs')]: {
      left: 70,
      width: 160,
      height: 60,
      borderRadius: '30px',
    },
  },
  duplicate3: {
    margin: 0,
    position: 'absolute',
    top: '30%',
    left: 400,
    zIndex: 11,
    width: 200,
    height: 100,
    backgroundColor: 'white',
    borderRadius: '50px',
    boxShadow: '0px 0px 5px 2px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      left: 320,
      width: 160,
      height: 80,
      borderRadius: '40px',
    },
    [theme.breakpoints.down('sm')]: {
      left: 240,
      width: 120,
      height: 70,
      borderRadius: '35px',
    },
    [theme.breakpoints.down('xs')]: {
      left: 200,
      width: 100,
      height: 60,
      borderRadius: '30px',
    },
  },
  clientlogo: {
    marginRight: 10,
    width: '40px',
    height: '40px',
    [theme.breakpoints.down('md')]: {
      width: '35px',
      height: '35px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '30px',
      height: '30px',
    },
    [theme.breakpoints.down('xs')]: {
      width: '25px',
      height: '25px',
    },
  },
  conTitle: {
    fontFamily: 'Noto Sans KR',
    fontWeight: 600,
    fontSize: 25,
    margin: 0,
    [theme.breakpoints.down('md')]: {
      fontSize: 20,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
    },
  },
  conText: {
    margin: 2,
    fontFamily: 'Noto Sans KR',
    fontWeight: 500,
    fontSize: 18,
    [theme.breakpoints.down('md')]: {
      fontSize: 16,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 13,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 10,
    },
  },
  text: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 16,
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.down('md')]: {
      fontSize: 15,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 13,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 15,
    },
  },
  slide: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  subAdtitle: {
    color: 'red',
    fontFamily: 'Noto Sans KR',
    fontSize: '25px',
    marginTop: 0,
    marginBottom: 10,
    [theme.breakpoints.down('md')]: {
      fontSize: 20,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 17,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 15,
    },
  },
  subAdtitle2: {
    color: '#3154EB',
    fontFamily: 'Noto Sans KR',
    fontSize: '25px',
    marginTop: 0,
    marginBottom: 10
  },
  subAdtitle3: {
    color: '#0D93BF',
    fontFamily: 'Noto Sans KR',
    fontSize: '25px',
    marginTop: 0,
    marginBottom: 10,
  },
  subAdSub: {
    color: 'white',
    fontFamily: 'Noto Sans KR',
    fontSize: 45,
    fontWeight: 600,
    backgroundColor: 'red',
    [theme.breakpoints.down('md')]: {
      fontSize: 30,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 25,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 23,
    },
  },
  subAdSub2: {
    color: 'white',
    fontFamily: 'Noto Sans KR',
    fontSize: 45,
    fontWeight: 600,
    backgroundColor: '#3154EB',
    [theme.breakpoints.down('md')]: {
      fontSize: 30,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 25,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 23,
    },
  },
  subAdSub3: {
    color: 'white',
    fontFamily: 'Noto Sans KR',
    fontSize: 45,
    fontWeight: 600,
    backgroundColor: '#0D93BF',
    [theme.breakpoints.down('md')]: {
      fontSize: 30,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 25,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 23,
    },
  },
  AdImg: {
    width: '650px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      width: '540px',
      height: '380px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '380px',
      height: '340px',
    },
    [theme.breakpoints.down('xs')]: {
      width: '300px',
      height: '280px',
    },
  },
  AdImg2: {
    width: '650px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      width: '540px',
      height: '380px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '380px',
      height: '340px',
    },
    [theme.breakpoints.down('xs')]: {
      width: '300px',
      height: '280px',
    },
  },
}));

export default styles;
