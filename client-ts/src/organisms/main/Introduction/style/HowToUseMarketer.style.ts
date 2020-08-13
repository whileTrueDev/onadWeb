import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(0),
  },
  marketerUse: {
    paddingTop: theme.spacing(2),
    color: 'white',
    wordBreak: 'keep-all',
    hegiht: 300
  },
  head: {
    fontFamily: 'Noto Sans kr',
    color: 'white',
    margin: theme.spacing(2, 0),
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
  numbertable: {
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(6),
    textAlign: 'center'
  },
  subTitle: {
    fontFamily: 'Noto Sans kr',
    color: 'white',
    margin: theme.spacing(2, 0)
  },
  useNumber: {
    borderRadius: '100%',
    backgroundColor: 'white',
    margin: '20px auto',
    color: '#3154EB',
    fontSize: 50,
    width: 80,
    height: 80,
    fontWeight: 600
  },
  Content: {
    marginTop: theme.spacing(2),
    fontSize: 15
  },
  inquireLink: {
    color: 'yellow',
    fontFamily: 'Noto Sans kr',
    border: '1px solid yellow',
    padding: '5px 10px',
    fontSize: 16,
    marginTop: 20
  },
  sampleLink: {
    color: 'white',
    fontFamily: 'Noto Sans kr',
    border: '1px solid white',
    padding: '5px 10px',
    fontSize: 16,
    marginTop: 20
  },
  guideButton:{
    border: '1px solid red',
    padding: '5px 10px',
    marginTop: 20,
    marginLeft: 10
  },
  guideLink:{
    color: 'red',
    fontFamily: 'Noto Sans kr',
    fontSize: 16
  },
  contentImg: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  semiTitle: {
    color: 'white',
    fontFamily: 'Noto Sans kr',
    fontWeight: 600
  }
}));

export default useStyles;
