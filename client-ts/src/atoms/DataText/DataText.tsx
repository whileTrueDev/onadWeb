import classnames from 'classnames';
import { makeStyles, Typography } from '@material-ui/core';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  dataText: {
    margin: theme.spacing(0.5, 0)
  },
  bold: {
    fontWeight: 'bold',
  },
  success: {
    color: theme.palette.success.dark
  }
}));

interface DataTextProps {
  name: string;
  value: React.ReactNode;
  iconComponent?: (props: SvgIconProps) => JSX.Element;
  iconColor?: SvgIconProps['color'] | 'success';
}

export default function DataText({
  name,
  value,
  iconComponent,
  iconColor = 'inherit',
}: DataTextProps): React.ReactElement {
  const classes = useStyles();
  const Icon = iconComponent;
  return (
    <Typography className={classes.dataText} component="div">
      <Typography component="span" className={classes.bold}>
        {Icon ? (
          <Icon
            fontSize="small"
            color={iconColor !== 'success' ? iconColor : 'action'}
            className={classnames({
              [classes.success]: iconColor === 'success'
            })}
            style={{ verticalAlign: 'middle', }}
          />
        ) : null}
        {name}
      </Typography>
      {': '}
      {value}
    </Typography>
  );
}
