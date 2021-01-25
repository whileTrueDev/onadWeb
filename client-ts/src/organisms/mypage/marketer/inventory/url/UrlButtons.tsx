import { Button } from '@material-ui/core';
import React from 'react';
import { useDialog } from '../../../../../utils/hooks';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';
import UrlUploadDialog from '../../shared/UrlUploadDialog';
import { UrlDataInterface } from '../interface';

export interface UrlButtonsProps {
  urlData: UseGetRequestObject<UrlDataInterface[] | null>;
}
export default function UrlButtons({
  urlData
}: UrlButtonsProps): JSX.Element {
  const urlUploadDialog = useDialog();

  return (
    <div>
      <Button color="primary" variant="outlined" onClick={(): void => { urlUploadDialog.handleOpen(); }}>
        + 새 URL 등록
      </Button>
      {/* landing url upload, delete dialog */}
      <UrlUploadDialog
        open={urlUploadDialog.open}
        handleClose={urlUploadDialog.handleClose}
        recallRequest={urlData.doGetRequest}
      />
    </div>
  );
}
