import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10),
  },
  loginButtonRight: {
    color: 'black',
    textAlign: 'left',
    width: '20%',
    fontSize: '20px',
    fontFamily: 'Noto Sans KR',
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
    },
  },
  h1: {
    marginTop: '0px',
    marginBottom: '5px',
    fontSize: 45,
    fontWeight: 500,
    [theme.breakpoints.down('md')]: {
      fontSize: 35,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 27,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 25,
    },
    color: 'black',
    fontFamily: 'Noto Sans KR',
  },
  h2: {
    marginTop: '5px',
    marginBottom: '20px',
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
    color: 'black',
    fontFamily: 'Noto Sans KR',
  },
  h1sub: {
    marginTop: 40,
    marginBottom: 40,
    color: 'black',
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.up('md')]: {
      margin: '30px 0px',
      wordBreak: 'keep-all'
    },
    [theme.breakpoints.up('sm')]: {
      margin: '10px 0px',
      wordBreak: 'keep-all'
    },
    [theme.breakpoints.down('sm')]: {
      margin: '20px 0px',
      wordBreak: 'keep-all'
    },
  },
  mainMiddle: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      justifyContent: 'center',
    },
  },
  mainMiddleLeftVideo: {
    width: '650px',
    height: '440px',
    [theme.breakpoints.down('md')]: {
      width: '540px',
      height: '380px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '300px',
      height: '240px',
    },
    [theme.breakpoints.down('xs')]: {
      width: '300px',
      height: '240px',
    },
  },
  buttonRight: {
    fontSize: theme.typography.pxToRem(14),
    fontWeight: theme.typography.fontWeightMedium,
    padding: theme.spacing(2, 2),
    boxShadow: 'none',
    '&:active, &:focus': {
      boxShadow: 'none',
    },
    width: '240px',
    color: '#3154EB',
    borderRadius: '5px',
    border: '1px solid #3154EB',
    [theme.breakpoints.down('md')]: {
      width: '230px',
      fontSize: 18,
    },
    [theme.breakpoints.down('sm')]: {
      width: '190px',
      fontSize: 13,
    },
    [theme.breakpoints.down('xs')]: {
      width: '190px',
      fontSize: 13,
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
  step: {
    width: 400,
    height: 120,
    [theme.breakpoints.down('md')]: {
      width: '350px',
      height: '105px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '225px',
      height: '75px',
    },
    [theme.breakpoints.down('xs')]: {
      width: '250px',
      height: '75px',
    },
  },
  slide: {
    marginRight: 80,
    width: '650px',
    height: '440px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      width: '540px',
      height: '380px',
      marginRight: 60,
    },
    [theme.breakpoints.down('sm')]: {
      width: '380px',
      height: '280px',
      marginRight: 0,
    },
    [theme.breakpoints.down('xs')]: {
      width: '300px',
      height: '240px',
      marginRight: 0,
    },
  }
}));


export default styles;
