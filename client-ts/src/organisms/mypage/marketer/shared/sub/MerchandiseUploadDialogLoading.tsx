import { LinearProgress, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(() => ({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  loadingContainer: {
    position: 'absolute', bottom: '50%', width: '100%', textAlign: 'center'
  }
}));

export interface MerchandiseUploadDialogLoadingProps {
  title?: string;
}
export default function MerchandiseUploadDialogLoading({
  title,
}: MerchandiseUploadDialogLoadingProps): React.ReactElement {
  const classes = useStyles();
  return (
    <div className={classes.backdrop}>
      <div className={classes.loadingContainer}>
        {title && <Typography>{title}</Typography>}
        <LinearProgress />
      </div>
    </div>
  );
}
