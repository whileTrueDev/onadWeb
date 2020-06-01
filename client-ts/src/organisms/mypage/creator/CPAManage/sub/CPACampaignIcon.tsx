import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  logo: { borderRadius: 10 },
  large: { width: 100, height: 100 },
  small: { width: 50, height: 50 }
});

interface CPACampaignIconProps {
  src?: string;
  size?: 'small' | 'large';
}
export default function CPACampaignIcon({
  src,
  size = 'large'
}: CPACampaignIconProps): JSX.Element {
  const classes = useStyles();
  return (
    <img
      src={src}
      alt=""
      className={classnames({
        [classes.logo]: true,
        [classes.large]: size === 'large',
        [classes.small]: size === 'small',
      })}
    />
  );
}
