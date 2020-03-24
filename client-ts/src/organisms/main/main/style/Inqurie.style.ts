import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(12),
    marginBottom: theme.spacing(5),
  },
  title: {
    fontFamily: 'Noto Sans KR',
    marginTop: '20px',
    marginBottom: '30px',
    fontWeight: 600,
    wordBreak: 'keep-all',
    [theme.breakpoints.down('sm')]: {
      fontSize: '25px',
    }
  },
  subTitle: {
    fontFamily: 'Noto Sans KR',
    wordBreak: 'keep-all',
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px',
    }
  },
  contentWraper: {
    margin: '20px auto',
    wordBreak: 'keep-all',
    // 브레이크 포인트 나눠서 반응형 내용추가 => 폭 너비 및 폰트크기
  },
  cardWrapper: {
    zIndex: 1,
    width: '100%'
  },
  card: {
    margin: '20px auto',
    border: '2px solid #3154EB',
    borderRadius: '10px',
    padding: theme.spacing(8, 3),
    width: '70%',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    }
  },
  cardContent: {
    marginBottom: theme.spacing(5),
  },
  datailContent: {
    minWidth: 30,
    marginTop: theme.spacing(2),
    borderRadius: 3,
    border: '1px solid #dddd',
    width: '100%',
    '&:hover': {
      border: '1px solid #3154EB'
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
    background: '#3154EB',
    color: 'white',
    height: '50px',
    fontSize: '20px',
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.down('xs')]: {
      width: '150px',
    }
  },
  detailTitle: {
    fontFamily: 'Noto Sans KR',
    fontWeight: 600,
    color: '#3154EB',
    [theme.breakpoints.down('sm')]: {
      fontSize: '15px',
    }
  },
  inputStyle: {
    boxShadow: '0px 0px 5px #00ace0',
    border: '1px solid #3154EB'
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
