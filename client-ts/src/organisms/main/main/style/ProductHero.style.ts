import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 50,
    fontFamily: 'Noto Sans KR',
  },
  loginButtonLeft: {
    color: 'white',
    textAlign: 'left',
    width: '30%',
    fontSize: '20px',
    fontFamily: 'Noto Sans KR',
    marginRight: 30,
    [theme.breakpoints.down('sm')]: {
      width: '35%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '80%',
    },
  },
  h1: {
    marginTop: '10px',
    marginBottom: '5px',
    fontFamily: 'Noto Sans KR',
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
    fontFamily: 'Noto Sans KR',
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
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column-reverse',
    },
  },
  maintopCenterVideo: {
    width: '750px',
    height: '500px',
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
  buttonLeft: {
    color: theme.palette.common.white,
    width: '40%',
    backgroundColor: '#3154EB',
    borderRadius: '5px',
    fontSize: theme.typography.pxToRem(14),
    marginRight: 20,
    fontWeight: theme.typography.fontWeightMedium,
    boxShadow: 'none',
    padding: theme.spacing(2, 2),
    '&:active, &:focus': {
      boxShadow: 'none',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 13,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 11,
      padding: '5px 5px'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 10,
      padding: '5px 5px'
    },
  },
  buttonRight: {
    color: theme.palette.common.white,
    width: '40%',
    borderRadius: '5px',
    border: '1px solid #3154EB',
    fontSize: theme.typography.pxToRem(14),
    fontWeight: theme.typography.fontWeightMedium,
    padding: theme.spacing(2, 2),
    boxShadow: 'none',
    '&:active, &:focus': {
      boxShadow: 'none',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 13,
      padding: '10px 10px'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 12,
      padding: '5px 5px'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 11,
      padding: '8px 8px'
    },
  },
}));

export default styles;
