import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10),
    padding: '0 2%',
  },
  platformWrapper: {
    margin: theme.spacing(5, 0)
  },
  selected: {
    color: theme.palette.common.white,
    backgroundColor: '#335cff',
    borderRadius: 20,
    height: 45,
    fontSize: 18,
    width: 200,
    '&:hover': {
      backgroundColor: '#335cff',
    },
    [theme.breakpoints.down('sm')]: {
      height: 33.75,
      width: 150,
    }
  },
  selected2: {
    color: theme.palette.common.white,
    backgroundColor: '#4bd4a6',
    borderRadius: 20,
    height: 45,
    fontSize: 18,
    width: 200,
    '&:hover': {
      backgroundColor: '#4bd4a6',
    },
    [theme.breakpoints.down('sm')]: {
      height: 33.75,
      width: 150,
    }
  },
  notSelected: {
    color: theme.palette.common.black,
    backgroundColor: '#f7f7f7',
    borderRadius: 20,
    height: 45,
    fontSize: 18,
    width: 200,
    '&:hover': {
      backgroundColor: '#335cff',
    },
    [theme.breakpoints.down('sm')]: {
      height: 33.75,
      width: 150,
    }
  },
  notSelected2: {
    color: theme.palette.common.black,
    backgroundColor: '#f7f7f7',
    borderRadius: 20,
    height: 45,
    fontSize: 18,
    width: 200,
    '&:hover': {
      backgroundColor: '#4bd4a6',
    },
    [theme.breakpoints.down('sm')]: {
      height: 33.75,
      width: 150,
    }
  },
  cotentWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  leftLine: {
    height: 1500,
    width: 10,
    background: 'linear-gradient(to bottom, #00e2ff, #5800ff)',
    borderRadius: 5,
    marginRight: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      marginRight: theme.spacing(2.5)
    },
    [theme.breakpoints.down('xs')]: {
      height: 1900,
    },
  },
  leftLine2: {
    height: 1100,
    width: 10,
    background: 'linear-gradient(to bottom, #00e2ff, #5800ff)',
    borderRadius: 5,
    marginRight: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      marginRight: theme.spacing(2.5)
    },
    [theme.breakpoints.down('xs')]: {
      height: 1900,
    },
  },
  leftLine3: {
    height: 1500,
    width: 10,
    background: 'linear-gradient(to bottom, #80ffac, #089f9f)',
    borderRadius: 5,
    marginRight: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      marginRight: theme.spacing(2.5)
    },
    [theme.breakpoints.down('xs')]: {
      height: 1900,
    },
  },
  leftLine4: {
    height: 1100,
    width: 10,
    background: 'linear-gradient(to bottom, #80ffac, #089f9f)',
    borderRadius: 5,
    marginRight: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      marginRight: theme.spacing(2.5)
    },
    [theme.breakpoints.down('xs')]: {
      height: 1400,
    },
  },
  contentTop: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
  },
  title: {
    fontWeight: theme.typography.fontWeightBold,
    [theme.breakpoints.down('md')]: {
      fontSize: 40
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 30
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 24
    },
  },
  contentBottom: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    margin: theme.spacing(8, 0),
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      margin: theme.spacing(3, 0),
    },
  },
  subContent: {
    width: '40%',
    [theme.breakpoints.down('sm')]: {
      width: '40%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      marginTop: theme.spacing(2)
    },
  },
  subContent2: {
    width: '50%',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      marginTop: theme.spacing(2)
    },
  },
  exImage: {
    width: 500,
    height: 250,
    margin: theme.spacing(0, 4),
    [theme.breakpoints.down('md')]: {
      width: 400,
      height: 200,
      margin: theme.spacing(0, 1),
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0, 0),
      width: 300,
      height: 150,
    },
    [theme.breakpoints.down('xs')]: {
      margin: '16px auto',
      width: 270,
      height: 135,
    }
  },
  exImage2: {
    width: 460,
    height: 256,
    marginRight: theme.spacing(0, 4),
    [theme.breakpoints.down('md')]: {
      width: 330,
      height: 184,
      margin: theme.spacing(0, 1),
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0, 0),
      width: 250,
      height: 139,
    },
    [theme.breakpoints.down('xs')]: {
      margin: '16px auto',
      width: 270,
      height: 150,
    },
  },
  subtitle: {
    fontWeight: theme.typography.fontWeightBold,
    color: '#008bf0',
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      fontSize: 30
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 24
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 22
    },
  },
  subtitle2: {
    fontWeight: theme.typography.fontWeightBold,
    color: '#008bf0',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      fontSize: 30
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 24
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 22
    },
  },
  subtitle3: {
    fontWeight: theme.typography.fontWeightBold,
    color: '#4bd4a6',
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      fontSize: 30
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 24
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 22
    },
  },
  subtitle4: {
    fontWeight: theme.typography.fontWeightBold,
    color: '#4bd4a6',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      fontSize: 30
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 24
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 22
    },
  },
  divider: {
    width: '100%',
    marginBottom: theme.spacing(10)
  }

}));

export default useStyles;
