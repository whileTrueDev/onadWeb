import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    backgroundColor: 'white',
    padding: '0 5%',
  },
  loginButtonRight: {
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      width: '50%',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    },
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    },
  },
  loginButtonRight2: {
    marginTop: 20,
    marginBottom: 40,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exBanner: {
    width: '900px',
    height: '700px',
    [theme.breakpoints.down('lg')]: {
      width: '700px',
      height: '500px',
    },
    [theme.breakpoints.down('md')]: {
      width: '500px',
      height: '400px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '360px',
      height: '288px',
    },
    [theme.breakpoints.down('xs')]: {
      width: '300px',
      height: '240px',
    },
  },
  exBanner2: {
    width: '1000px',
    height: '800px',
    [theme.breakpoints.down('lg')]: {
      width: '900px',
      height: '700px',
    },
    [theme.breakpoints.down('md')]: {
      width: '700px',
      height: '550px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '500px',
      height: '400px',
    },
    [theme.breakpoints.down('xs')]: {
      width: '300px',
      height: '240px',
    },
  },
  h1: {
    marginTop: '0px',
    marginBottom: '5px',
    fontSize: 45,
    wordBreak: 'keep-all',
    fontWeight: 600,
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
    color: '#0D93BF',
    fontFamily: 'Noto Sans KR',
  },
  mainMiddle: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainMiddle2: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: 80,
  },
  costContent: {
    width: '40%',
    [theme.breakpoints.down('sm')]: {
      width: '60%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  costCardWrapper: {
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  costCardTitle: {
    marginTop: 0,
    marginBottom: 15,
    fontSize: 30,
    fontFamily: 'Noto Sans KR',
    fontWeight: 600,
    [theme.breakpoints.down('md')]: {
      fontSize: 25
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 22
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 18
    },
  },
  costCardCon: {
    margin: '5px',
    fontSize: 20,
    fontFamily: 'Noto Sans KR',
    fontWeight: 550,
    [theme.breakpoints.down('md')]: {
      fontSize: 18
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 14
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12
    },
  },
  subAdtitle: {
    color: 'black',
    fontFamily: 'Noto Sans KR',
    fontSize: '20px',
    marginTop: 0,
    marginBottom: 10,
    fontWeight: 600
  },
  costContent2: {
    width: '100%',
  },
  subAdtitle2: {
    color: 'black',
    fontFamily: 'Noto Sans KR',
    fontSize: '20px',
    marginTop: 0,
    marginBottom: 10,
    fontWeight: 500,
    [theme.breakpoints.down('md')]: {
      fontSize: 18,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 15,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
    },

  },
  subAdSub: {
    color: 'white',
    fontFamily: 'Noto Sans KR',
    fontSize: 45,
    fontWeight: 600,
    backgroundColor: 'red'
  },
  subAdSub2: {
    color: 'black',
    fontFamily: 'Noto Sans KR',
    fontSize: 45,
    fontWeight: 600,
    backgroundColor: '#3154EB'
  },
  costCard: {
    width: '95%',
    display: 'flex',
    flexDirection: 'column',
    padding: 30,
    boxShadow: '0px 0px 5px 1px rgba(0,0,0,0.2)',
    marginTop: 30,
    marginBottom: 30,
    borderRadius: '15px',
    textAlign: 'left'
  },
  costCard2: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    padding: 30,
    boxShadow: '0px 0px 5px 1px rgba(0,0,0,0.2)',
    marginTop: 15,
    marginBottom: 15,
    borderRadius: '15px',
    textAlign: 'left',
    marginRight: 30,
    [theme.breakpoints.down('xs')]: {
      width: '85%',
    },
  },
}));

export default useStyles;
