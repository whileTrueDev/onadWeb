import {
  successColor,
  whiteColor,
  grayColor,
  dangerColor,
  infoColor,
  hexToRgb,
} from '../../onad';

const dashboardStyle = {
  successText: {
    color: successColor[0],
  },
  dangerText: {
    color: dangerColor[0],
    fontWeight: 'bold',
  },
  infoText: {
    color: infoColor[0],
    fontWeight: 'bold',
  },
  upArrowCardCategory: {
    width: '16px',
    height: '16px',
  },
  stats: {
    color: grayColor[0],
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
    color: grayColor[0],
    textAlign: 'center',
    margin: '0',
    fontSize: '20px',
    marginTop: '0',
    paddingTop: '10px',
    marginBottom: '0',
  },
  cardCategoryWhite: {
    color: `rgba(${hexToRgb(whiteColor)},.62)`,
    textAlign: 'center',
    margin: '0',
    fontSize: '16px',
    marginTop: '0',
    marginBottom: '0',
  },
  cardTitle: {
    color: grayColor[2],
    textAlign: 'center',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', 'Nanum Gothic', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: grayColor[1],
      fontWeight: '400',
      lineHeight: '1',
    },
  },
  cardTitleWhite: {
    color: whiteColor,
    textAlign: 'center',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', 'Nanum Gothic', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: grayColor[1],
      fontWeight: '400',
      lineHeight: '1',
    },
  },
};

export default dashboardStyle;
