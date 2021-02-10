import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  titleWapper: {
    margin: theme.spacing(3,0),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  titleLine: {
    marginRight: theme.spacing(4),
    height: 50,
    width: 10,
    borderRadius: 5,
    background: 'linear-gradient(to bottom, #00e2ff, #5800ff)',
  },
  title: {
    fontFamily: 'Noto Sans KR',
    marginRight: theme.spacing(2),
    fontWeight: theme.typography.fontWeightBold,
    wordBreak: 'keep-all',
    [theme.breakpoints.down('sm')]: {
      fontSize: '25px',
    }
  },
  subTitle: {
    fontFamily: 'Noto Sans KR',
    wordBreak: 'keep-all',
    color: '#0074d8',
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px',
    }
  },
  contentWraper: {
    margin: '20px auto',
    wordBreak: 'keep-all',
  },
  cardWrapper: {
    zIndex: 1,
    width: '100%'
  },
  card: {
    margin: '20px auto',
    width: '100%',
  },
  cardContent: {
    marginBottom: theme.spacing(5),
  },
  datailContent: {
    minWidth: 30,
    marginTop: theme.spacing(2),
    borderRadius: 10,
    border: '1px solid #dddd',
    width: '100%',
    backgroundColor: theme.palette.divider,
    '&:hover': {
      border: '1px solid #0074d8',
      backgroundColor: theme.palette.common.white,
    }
  },
  textField: {
    width: '100%',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  checkboxRoot: {
    color: '#3154EB',
    '&$checked': {
      color: '#3154EB',
    },
  },
  detailWrap: {
    padding: '0 16px',
    [theme.breakpoints.down('xs')]: {
      padding: '0 10px',
    }
  },
  checked: {},
  button: {
    width: '200px',
    background: '#0074d8',
    borderRadius: 20,
    color: 'white',
    height: '50px',
    fontSize: '20px',
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.down('xs')]: {
      width: '150px',
    },
    '&:hover': {
      background: '#0074d8',
    }
  },
  detailTitle: {
    fontFamily: 'Noto Sans KR',
    fontWeight: 600,
    color: '#0074d8',
    [theme.breakpoints.down('sm')]: {
      fontSize: '15px',
    }
  },
  notColoredTitle: {
    fontFamily: 'Noto Sans KR',
    fontWeight: 600,
    [theme.breakpoints.down('sm')]: {
      fontSize: '15px',
    }
  },
  inputStyle: {
    boxShadow: '0px 0px 5px #00ace0',
    border: '1px solid #3154EB',
    backgroundColor: theme.palette.common.white,
  },
  buttonProgress: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default useStyles;
