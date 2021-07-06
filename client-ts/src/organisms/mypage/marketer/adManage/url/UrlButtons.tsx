import { Button, makeStyles } from '@material-ui/core';
import { useQueryClient } from 'react-query';
import { useDialog } from '../../../../../utils/hooks';
import UrlUploadDialog from '../../shared/UrlUploadDialog';

const useStyles = makeStyles(theme => ({
  container: { marginBottom: theme.spacing(1) },
}));

export default function UrlButtons(): JSX.Element {
  const queryClient = useQueryClient();
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
        onSuccess={() => queryClient.invalidateQueries('marketerLandingUrlList')}
      />
    </div>
  );
}
