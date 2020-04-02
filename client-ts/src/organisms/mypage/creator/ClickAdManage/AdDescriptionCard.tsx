import React from 'react';
import classnames from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Typography, Divider } from '@material-ui/core';
import Card from '../../../../atoms/Card/Card';

const useStyles = makeStyles((theme) => ({
  head: { display: 'flex', justifyContent: 'space-between', padding: theme.spacing(2) },
  body: {
    display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100
  },
  last: { paddingBottom: theme.spacing(2) },
  emphasizedText: {
    color: theme.palette.secondary.main, fontWeight: theme.typography.fontWeightBold
  }
}));

interface AdDescriptionCardProps {
  title: string; value?: string | number; unit?: string; children?: React.ReactNode;
}
export default function AdDescriptionCard({
  title, value, unit, children
}: AdDescriptionCardProps): JSX.Element {
  const classes = useStyles();
  return (
    <Card>
      <div className={classes.head}>
        <Typography variant="h6">
          {title}
        </Typography>
      </div>

      <Divider />

      {children ? (
        <div className={classnames(classes.body, classes.last)}>
          {children}
        </div>
      ) : (
        <div className={classnames(classes.body, classes.last)}>
          <Typography variant="h4">{value}</Typography>
          {unit && (
          <Typography variant="body2">
            &emsp;
            {unit}
          </Typography>
          )}
        </div>
      )}
    </Card>
  );
}
