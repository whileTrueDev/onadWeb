import { makeStyles, Theme } from '@material-ui/core/styles';

const useCampaignTableStyles = makeStyles((theme: Theme) => ({
  stats: {
    color: theme.palette.text.hint,
    display: 'inline-flex',
    fontSize: '14px',
    lineHeight: '22px',
    '& svg': {
      width: '20px',
      height: '20px',
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
    alignItems: 'center',
  },
  head: {
    fontWeight: 500,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.80rem',
    },
  },
  unit: {
    fontWeight: 700,
    marginLeft: '3px',
  },
  level: {
    fontWeight: 700,
    marginLeft: '3px',
  },
  grid: {
    justifyContent: 'center',
    // alignItems: 'center'
  },
  textCell: {
    textAlign: 'left',
  },
  cash: {
    fontSize: '1.8rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.3rem',
    },
  },
}));

export default useCampaignTableStyles;
