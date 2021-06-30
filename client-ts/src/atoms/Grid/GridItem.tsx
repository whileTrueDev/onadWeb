import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid, { GridProps } from '@material-ui/core/Grid';

const useStyles = makeStyles({
  grid: {
    padding: '0 8px !important',
  },
});

function GridItem({ children, ...rest }: GridProps): JSX.Element {
  const classes = useStyles();
  return (
    <Grid item {...rest} className={classes.grid}>
      {children}
    </Grid>
  );
}

export default GridItem;
