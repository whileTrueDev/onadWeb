import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  stats: {
    color: '#999',
    display: 'inline-flex',
    fontSize: '14px',
    lineHeight: '22px',
    '& svg': {
      top: '4px',
      width: '16px',
      height: '16px',
      position: 'relative',
      marginRight: '3px',
      marginLeft: '3px',
    },
    '& .fab,& .fas,& .far,& .fal,& .material-icons': {
      top: '4px',
      fontSize: '16px',
      position: 'relative',
      marginRight: '3px',
      marginLeft: '3px',
    },
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  head: {
    fontWeight: 500,
    color: theme.palette.info.main,
  },
  unit: {
    fontWeight: 700,
    marginLeft: '3px'
  },
  level: {
    fontWeight: 700,
    marginLeft: '1px'
  },
  text1: {
    fontWeight: 500,
    // color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '14px',
    margin: '16px',
    marginBottom: '3px'
  },
  text2: {
    fontWeight: 500,
    // color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '14px',
    margin: '16px',
    marginTop: 0
  }
}));

export default useStyles;
