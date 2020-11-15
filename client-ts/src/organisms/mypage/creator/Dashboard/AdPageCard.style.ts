import { makeStyles, Theme } from '@material-ui/core/styles';

const useLandingCardStyles = makeStyles((theme: Theme) => ({
  stats: {
    color: theme.palette.text.hint,
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
  },
  unit: {
    fontWeight: 700,
    marginLeft: '3px'
  },
}));

export default useLandingCardStyles;
