import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  rightLink: {
    fontFamily: 'Noto Sans KR',
    color: theme.palette.common.white,
    marginLeft: 0,
    fontSize: 20,
    fontWeight: 'bold',
    [theme.breakpoints.up('md')]: {
      color: theme.palette.common.white,
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      '&:hover': {
        fontWeight: 'bold',
      },
    },
  },
  rightLink2: {
    fontFamily: 'Noto Sans KR',
    color: 'black',
    marginLeft: 0,
    fontSize: 20,
    fontWeight: 'bold',
    [theme.breakpoints.up('md')]: {
      color: 'black',
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      '&:hover': {
        fontWeight: 'bold',
      },
    },
  },
  str_rightLink: {
    fontFamily: 'Noto Sans KR',
    width: 180,
    background: '#3154EB',
    color: theme.palette.common.white,
    marginLeft: 0,
    fontSize: 20,
    height: '100%',
    padding: '0px 10px',
    fontWeight: 'bold',
    '&:hover': {
      background: '#3154EB',
    },
    [theme.breakpoints.up('md')]: {
      color: theme.palette.common.white,
      marginLeft: theme.spacing(3),
      '&:hover': {
        fontWeight: 'bold',
      },
    },
  },
  button: {
    width: '100%',
  },
}));

export default useStyles;
