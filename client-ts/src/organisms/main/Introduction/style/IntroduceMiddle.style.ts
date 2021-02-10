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
    }
  },
  cotentWrapper: {
    width: '100%',
    display:'flex',
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
    marginRight: theme.spacing(5)
  },
  leftLine2: {
    height: 1100,
    width: 10,
    background: 'linear-gradient(to bottom, #00e2ff, #5800ff)',
    borderRadius: 5,
    marginRight: theme.spacing(5)
  },
  leftLine3: {
    height: 1500,
    width: 10,
    background: 'linear-gradient(to bottom, #80ffac, #089f9f)',
    borderRadius: 5,
    marginRight: theme.spacing(5)
  },
  leftLine4: {
    height: 1100,
    width: 10,
    background: 'linear-gradient(to bottom, #80ffac, #089f9f)',
    borderRadius: 5,
    marginRight: theme.spacing(5)
  },
  contentTop: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: {
    fontWeight: theme.typography.fontWeightBold
  },
  contentBottom: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    margin: theme.spacing(8,0)
  },
  subContent: {
    width: '40%'
  },
  subContent2: {
    width: '50%'
  },
  exImage: {
    width: 600,
    height: 300,
    margin: theme.spacing(0,8)
  },
  exImage2: {
    width: 540,
    height: 300,
    marginRight: theme.spacing(0,5)
  },
  subtitle: {
    fontWeight: theme.typography.fontWeightBold,
    color: '#008bf0',
    marginBottom: theme.spacing(1)
  },
  subtitle2: {
    fontWeight: theme.typography.fontWeightBold,
    color: '#008bf0',
    marginTop: theme.spacing(4)
  },
  subtitle3: {
    fontWeight: theme.typography.fontWeightBold,
    color: '#4bd4a6',
    marginBottom: theme.spacing(1)
  },
  subtitle4: {
    fontWeight: theme.typography.fontWeightBold,
    color: '#4bd4a6',
    marginTop: theme.spacing(4)
  },
  divider: {
    width: '100%',
    marginBottom: theme.spacing(10)
  }
  
}));

export default useStyles;
