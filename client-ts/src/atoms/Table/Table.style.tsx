import { Theme, makeStyles } from '@material-ui/core/styles';

const useTableStyles = makeStyles((theme: Theme) => ({
  table: {
    marginBottom: '0',
    width: '100%',
    maxWidth: '100%',
    backgroundColor: 'transparent',
    borderSpacing: '0',
    borderCollapse: 'collapse',
  },
  tableHeadCell: {
    textAlign: 'center',
    color: theme.palette.text.primary,
    fontWeight: theme.typography.body1.fontWeight,
    fontSize: theme.typography.body1.fontSize,
  },
  tableCell: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.primary,
    fontWeight: theme.typography.body1.fontWeight,
    fontSize: theme.typography.body1.fontSize,
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
}));

export default useTableStyles;
