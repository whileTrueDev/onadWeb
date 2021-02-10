import { makeStyles, Theme } from '@material-ui/core/styles';

const useFooterStyle = makeStyles((theme: Theme) => ({
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  },
  flex: { display: 'flex', justifyContent: 'center', alignItems: 'center' }
}));
export default useFooterStyle;
