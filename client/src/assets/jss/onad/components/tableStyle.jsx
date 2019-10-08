import {
  warningColor,
  primaryColor,
  dangerColor,
  successColor,
  infoColor,
  roseColor,
  grayColor,
  defaultFont,
} from '../../onad';

const tableStyle = theme => ({
  warningTableHeader: {
    color: warningColor[0],
  },
  primaryTableHeader: {
    color: primaryColor[0],
  },
  dangerTableHeader: {
    color: dangerColor[0],
  },
  successTableHeader: {
    color: successColor[0],
  },
  infoTableHeader: {
    color: infoColor[0],
  },
  roseTableHeader: {
    color: roseColor[0],
  },
  grayTableHeader: {
    color: grayColor[0],
  },
  table: {
    marginBottom: '0',
    width: '100%',
    maxWidth: '100%',
    backgroundColor: 'transparent',
    borderSpacing: '0',
    borderCollapse: 'collapse',
  },
  tableHeadCell: {
    color: 'inherit',
    ...defaultFont,
    fontSize: '1em',
  },
  tableCell: {
    ...defaultFont,
    lineHeight: '1.42857143',
    padding: '12px 8px',
    verticalAlign: 'middle',
    fontWeight: 500,
    fontSize: '1.1em'
  },
  tableFooter: {
    ...defaultFont,
    borderBottom: 'none',
  },
  tableFooterPagination: {
    ...defaultFont,
    borderBottom: 'none',
  },
  tableResponsive: {
    width: '100%',
    marginTop: theme.spacing(1),
    overflowX: 'auto',
  },
  imgCell: {
    [theme.breakpoints.up('md')]: {
      maxWidth: '12vh',
    },
    maxHeight: '6vh',
  },
  tableButton: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '2px',
    },
  },
  ButtonCell: {
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  },
  imgCellNoPage: {
    maxWidth: '5.7vh',
    maxHeight: '2.6vh',
    [theme.breakpoints.down('sm')]: {
      maxHeight: '50px',
    },

  },
});

export default tableStyle;
