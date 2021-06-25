import classnames from 'classnames';
import CountUp from 'react-countup';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  contents: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
    padding: '48px 0px',
    alignItems: 'center',
  },
  valueWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  valueDesc: { fontWeight: 700, paddingBottom: 16 },
  value: { fontWeight: 700 },
  primaryColor: { color: theme.palette.primary.main },
  secondaryColor: { color: theme.palette.secondary.main },
}));

interface Value {
  desc: string;
  value: number;
}
interface MetricsExpressionProps {
  left?: Value;
  right?: Value;
  result: Value;
  color: 'primary' | 'secondary';
}

export default function MetricsExpression(props: MetricsExpressionProps): JSX.Element {
  const classes = useStyles();
  const { left, right, result, color } = props;

  return (
    <div className={classes.contents}>
      {left && right && (
        <>
          <div className={classes.valueWrapper}>
            <Typography variant="body1" className={classes.valueDesc}>
              {left.desc}
            </Typography>
            <Typography variant="h5" className={classes.value}>
              <CountUp duration={1} end={left.value} />
            </Typography>
            {right.value && left.value && (
              <Typography variant="body1">
                {`${((left.value / (right.value + left.value)) * 100).toFixed(1)}%`}
              </Typography>
            )}
          </div>
          <Typography variant="h4">+</Typography>
          <div className={classes.valueWrapper}>
            <Typography variant="body1" className={classes.valueDesc}>
              {right.desc}
            </Typography>
            <Typography variant="h5" className={classes.value}>
              <CountUp duration={1} end={right.value} />
            </Typography>
            {right.value && left.value && (
              <Typography variant="body1">
                {`${((right.value / (left.value + right.value)) * 100).toFixed(1)}%`}
              </Typography>
            )}
          </div>
          <Typography variant="h4">=</Typography>
        </>
      )}
      <div className={classes.valueWrapper}>
        <Typography variant="body1" className={classes.valueDesc}>
          {result.desc}
        </Typography>
        <Typography
          variant="h5"
          className={classnames({
            [classes.value]: true,
            [classes.primaryColor]: color === 'primary',
            [classes.secondaryColor]: color === 'secondary',
          })}
        >
          <CountUp duration={1} end={result.value} />
        </Typography>
      </div>
    </div>
  );
}
