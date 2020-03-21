import { makeStyles, Theme } from '@material-ui/core/styles';

const useNavbarStyles = makeStyles((theme: Theme) => ({
  appBar: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    borderBottom: '0',
    marginBottom: '0',
    position: 'absolute',
    width: '100%',
    paddingTop: '10px',
    zIndex: 10,
    color: theme.palette.grey[300],
    border: '0',
    borderRadius: '3px',
    padding: '10px 0',
    transition: 'all 150ms ease 0s',
    minHeight: '50px',
    display: 'block',
  },
  container: {
    paddingRight: '15px',
    paddingLeft: '15px',
    marginRight: 'auto',
    marginLeft: 'auto',
    minHeight: '50px',
  },
  flex: {
    flex: 1,
  },
  title: {
    lineHeight: '30px',
    fontSize: '18px',
    borderRadius: '3px',
    textTransform: 'none',
    margin: '0',
    '&:hover,&:focus': {
      background: 'transparent',
    },
  },
  appResponsive: {
    top: '8px',
  },
}));

export default useNavbarStyles;
