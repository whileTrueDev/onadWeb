import { makeStyles, Theme } from '@material-ui/core/styles';

const useHeaderLinksStyles = makeStyles((theme: Theme) => ({
  buttonLink: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      margin: '10px 15px 0',
      width: '-webkit-fill-available',
      '& svg': {
        width: '30px',
        height: '30px',
        marginRight: '15px',
        marginLeft: '-15px',
      },
      '& .fab,& .fas,& .far,& .fal,& .material-icons': {
        fontSize: '24px',
        lineHeight: '30px',
        width: '24px',
        height: '30px',
        marginRight: '15px',
        marginLeft: '-15px',
      },
      '& > span': {
        justifyContent: 'flex-end',
        width: '100%',
      },
    },
  },
  margin: {
    zIndex: 4,
    margin: '0',
  },
}));

export default useHeaderLinksStyles;
