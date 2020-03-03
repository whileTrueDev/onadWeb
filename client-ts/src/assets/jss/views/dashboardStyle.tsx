import { Theme } from '@material-ui/core/styles';
import { hexToRgb } from '../onad';

const dashboardStyle = (theme: Theme): object => ({
  stats: {
    color: theme.palette.grey[500],
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
  cardCategory: {
    color: theme.palette.grey[500],
    textAlign: 'center',
    margin: '0',
    fontSize: '20px',
    marginTop: '0',
    paddingTop: '10px',
    marginBottom: '0',
  },
  cardCategoryWhite: {
    color: `rgba(${hexToRgb(theme.palette.common.white)},.62)`,
    textAlign: 'center',
    margin: '0',
    fontSize: '16px',
    marginTop: '0',
    marginBottom: '0',
  },
  cardTitle: {
    color: theme.palette.grey[500],
    textAlign: 'center',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    // fontFamily: "'Roboto', 'Helvetica', 'Arial', 'Nanum Gothic', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: theme.palette.grey[500],
      fontWeight: '400',
      lineHeight: '1',
    },
  },
  cardTitleWhite: {
    color: theme.palette.common.white,
    textAlign: 'center',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    // fontFamily: "'Roboto', 'Helvetica', 'Arial', 'Nanum Gothic', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: theme.palette.grey[500],
      fontWeight: '400',
      lineHeight: '1',
    },
  },
});

export default dashboardStyle;
