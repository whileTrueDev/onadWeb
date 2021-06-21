import { Button, makeStyles } from '@material-ui/core';
import React from 'react';
import { useDialog } from '../../../../../utils/hooks';
import { UsePaginatedGetRequestObject } from '../../../../../utils/hooks/usePaginatedGetRequest';
import UrlUploadDialog from '../../shared/UrlUploadDialog';
import { UrlDataInterface } from '../interface';

const useStyles = makeStyles(theme => ({
  container: { marginBottom: theme.spacing(1) },
}));
export interface UrlButtonsProps {
  urlData: UsePaginatedGetRequestObject<UrlDataInterface>;
}
export default function UrlButtons({ urlData }: UrlButtonsProps): JSX.Element {
  const classes = useStyles();
  const urlUploadDialog = useDialog();

  return (
    <div className={classes.container}>
      <Button
        color="primary"
        variant="outlined"
        onClick={(): void => {
          urlUploadDialog.handleOpen();
        }}
      >
        + 새 URL 등록
      </Button>
      {/* landing url upload, delete dialog */}
      <UrlUploadDialog
        open={urlUploadDialog.open}
        handleClose={urlUploadDialog.handleClose}
        recallRequest={urlData.request}
      />
    </div>
  );
}
