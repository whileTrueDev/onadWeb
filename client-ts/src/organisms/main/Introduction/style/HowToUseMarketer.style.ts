import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: theme.spacing(5, 0),
  },
  marketerUse: {
    padding: theme.spacing(3, 4),
    wordBreak: 'keep-all',
    borderTop: '1px solid #00a7ff',
    borderLeft: '1px solid #00a7ff',
    borderBottom: '1px solid #00a7ff',
    position: 'relative',
    [theme.breakpoints.between('sm', 'sm')]: {
      padding: theme.spacing(1.5, 2),
      borderLeft: 'none',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    [theme.breakpoints.down('xs')]: {
      borderLeft: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }
  },
  lineDecoration: {
    width: 130,
    position: 'absolute',
    left: -1,
    top: -5,
    borderBottom: '5px solid #00a7ff'
  },
  subTitle: {
    fontFamily: 'Noto Sans kr',
    color: 'white',
    margin: theme.spacing(2, 0),
    [theme.breakpoints.down('sm')]: {
      fontSize: 35
    }
  },
  useNumber: {
    color: '#196ee3',
    fontWeight: theme.typography.fontWeightBold,
    [theme.breakpoints.down('sm')]: {
      fontSize: 45
    }
  },
  Content: {
    marginTop: theme.spacing(2),
    fontSize: 15
  },
  inquiryLink: {
    color: '#196ee3',
    fontFamily: 'Noto Sans kr',
    textDecoration: 'underline',
    '&:hover': {
      cursor: 'pointer'
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  sampleLink: {
    fontFamily: 'Noto Sans kr',
    border: '1px solid black',
    borderRadius: 10,
    width: 100,
    fontSize: 16,
    marginTop: 20
  },
  guideButton:{
    color: 'white',
    background: '#4083ff',
    marginTop: 20,
    marginLeft: 10,
    borderRadius: 10,
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
    }
  },
  guideLink:{
    color: 'white',
    fontFamily: 'Noto Sans kr',
    fontSize: 16,
  },
  contentImg: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  semiTitle: {
    color: '#196ee3',
    fontFamily: 'Noto Sans kr',
    fontWeight: theme.typography.fontWeightBold
  }
}));

export default useStyles;
