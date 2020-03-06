
const tableStyle = (theme) => ({
  warningTableHeader: {
    color: theme.palette.warning.main,
  },
  primaryTableHeader: {
    color: theme.palette.primary.main,
  },
  dangerTableHeader: {
    color: theme.palette.error.main,
  },
  successTableHeader: {
    color: theme.palette.success.main,
  },
  infoTableHeader: {
    color: theme.palette.info.main,
  },
  grayTableHeader: {
    color: theme.palette.grey[300],
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
    fontSize: '1em',
    textAlign: 'center'
  },
  tableCell: {
    lineHeight: '1.42857143',
    padding: '10px 8px',
    // padding: 0,
    verticalAlign: 'middle',
    fontWeight: 500,
    fontSize: '1.1em',
    textAlign: 'center'
  },
  tableFooter: {
    borderBottom: 'none',
  },
  tableFooterPagination: {
    borderBottom: 'none',
  },
  tableResponsive: {
    width: '100%',
    marginTop: theme.spacing(1),
    overflowX: 'auto',
  },
  imgCell: {
    padding: '10px 8px',
    [theme.breakpoints.up('md')]: {
      maxWidth: '25vh',
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
