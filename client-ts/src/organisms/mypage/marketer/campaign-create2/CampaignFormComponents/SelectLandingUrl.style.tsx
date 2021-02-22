import { makeStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) => ({
  input: {
    fontSize: '14px',
    fontWeight: 700,
    color: theme.palette.text.primary,
    margin: '4px'
  },
  inputName: {
    fontSize: '14px',
    fontWeight: 700,
    color: theme.palette.text.primary,
  },
  label: {
    fontSize: '20px',
    fontWeight: 700,
    margin: '3px',
  },
  landinglist: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: theme.palette.background.paper,
    maxHeight: 300,
    overflow: 'auto',
  },
  selectedLanding: {
    maxWidth: 600, lineBreak: 'anywhere', width: '100%',
  },
}));
