
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  rightLink: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    [theme.breakpoints.up('md')]: {
      color: theme.palette.common.black,
      margin: theme.spacing(0, 3),
    },
  },
  str_rightLink: {
    width: 160,
    background: 'linear-gradient(to right, #3589fc, #0dd0ff)',
    color: theme.palette.common.white,
    marginLeft: 0,
    fontSize: 18,
    height: 40,
    padding: '0px 10px',
    fontWeight: 'bold',
    borderRadius: 20,
    [theme.breakpoints.up('md')]: {
      color: theme.palette.common.white,
      marginLeft: theme.spacing(3),
      '&:hover': {
        fontWeight: 'bold',
      },
    },
  },
  str_rightLink2: {
    width: 160,
    background: 'linear-gradient(to right, #54eacd, #5ed7ed)',
    color: theme.palette.common.white,
    marginLeft: 0,
    fontSize: 18,
    height: 40,
    padding: '0px 10px',
    fontWeight: 'bold',
    borderRadius: 20,
    [theme.breakpoints.up('md')]: {
      color: theme.palette.common.white,
      marginLeft: theme.spacing(3),
      '&:hover': {
        fontWeight: 'bold',
      },
    },
  },
}));

export default useStyles;
