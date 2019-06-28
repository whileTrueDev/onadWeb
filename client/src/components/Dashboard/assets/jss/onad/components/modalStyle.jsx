import {
  container,
  defaultFont,
  primaryColor,
  defaultBoxShadow,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
  whiteColor,
  blueGrayColor,
  roseColor,
} from '../../onad';

const modalStyle = theme => ({
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  },
  appBar: {
    ...container,
    borderRadius: '0%',
    height: '60px',
  },
  sectionButton: {
    flex: 1,
    display: 'none',
    justifyContent: 'flex-end',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  inModalContent: {
    ...defaultFont,
    padding: theme.spacing(3),
    marginLeft: 30,
    marginRight: 55,
    outline: 'none',
  },
  primary: {
    backgroundColor: primaryColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  info: {
    backgroundColor: infoColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  success: {
    backgroundColor: successColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  warning: {
    backgroundColor: warningColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  danger: {
    backgroundColor: dangerColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  blueGray: {
    backgroundColor: blueGrayColor[5],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  rose: {
    backgroundColor: roseColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
});

export default modalStyle;
