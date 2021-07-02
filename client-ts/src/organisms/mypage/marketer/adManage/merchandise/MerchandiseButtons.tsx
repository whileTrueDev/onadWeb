import { Button, makeStyles } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import MerchandiseUploadDialog from '../../shared/MerchandiseUploadDialog';
import { useDialog } from '../../../../../utils/hooks';
import Snackbar from '../../../../../atoms/Snackbar/Snackbar';
import { UsePaginatedGetRequestObject } from '../../../../../utils/hooks/usePaginatedGetRequest';
import { Merchandise } from '../interface';

const useStyles = makeStyles(theme => ({
  container: { marginBottom: theme.spacing(1) },
}));

export interface MerchandiseButtonsProps {
  merchandiseData: UsePaginatedGetRequestObject<Merchandise>;
}
export default function MerchandiseButtons({
  merchandiseData,
}: MerchandiseButtonsProps): JSX.Element {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  // 상품 등록 다이얼로그
  const merchandiseUploadDialog = useDialog();

  return (
    <div className={classes.container}>
      <Button color="primary" variant="outlined" onClick={merchandiseUploadDialog.handleOpen}>
        + 새 상품 등록
      </Button>

      <MerchandiseUploadDialog
        open={merchandiseUploadDialog.open}
        onClose={merchandiseUploadDialog.handleClose}
        onSuccess={() => {
          enqueueSnackbar('상품 등록을 완료하였습니다.', { variant: 'success' });
          merchandiseUploadDialog.handleClose();
          merchandiseData.requestWithoutConcat();
        }}
        onFail={() => {
          enqueueSnackbar('상품 등록 과정에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', {
            variant: 'error',
          });
        }}
      />
    </div>
  );
}
