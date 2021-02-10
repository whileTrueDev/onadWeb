import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(5)}px 10%`,
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    margin: '20px auto'
  },
  iconsWrapper: {
    height: 30,
    marginTop: 10,
    marginBottom: 20
  },
  icons: {
    display: 'flex',
    alignItems: 'center',
  },
  name: {
    fontWeight: theme.typography.fontWeightBold,
    [theme.breakpoints.down('sm')]: {
      width: 20,
      fontSize: 15,
    },
  },
  iconLogo: {
    width: 40,
    height: 40
  },
  Wrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 30,
    height: 30,
    marginLeft: theme.spacing(2)
  },
  address: {
    marginLeft: '7px',
    marginRight: '20px',
    marginTop: 5,
    marginBottom: 5,
    fontSize: '15px',
    fontWeight: 300,
  },
  addressTitle: {
    fontFamily: 'Noto Sans KR',
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
    fontSize: '15px',
    '& div': {
      display: 'inline-table',
    },
  },
  addressLocation: {
    fontFamily: 'Noto Sans KR',
    fontWeight: 300,
    fontSize: '15px',
  },
  list: {
    margin: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'row',
    padding: 0
  },
  listItem: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    marginLeft: 30,
    fontWeight: 500,
    fontSize: 18,
    '&:hover': {
      fontWeight: 'bold',
    },
    '&>a': {
      padding: 0,
      paddingLeft: '15px',
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: 15
    },
  },
  corp: {
    fontFamily: 'Noto Sans KR',
    fontWeight: 300,
    marginTop: '15px',
    '& strong': {
      fontWeight: 900,
    },
  },
  right: {
    float: 'right',
    display: 'inline',
  },
}));

export default useStyles;
