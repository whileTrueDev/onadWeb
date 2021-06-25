import { Button, makeStyles } from '@material-ui/core';
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

  // 상품 등록 다이얼로그
  const merchandiseUploadDialog = useDialog();

  // 상품 등록 성공 스낵바
  const successSnack = useDialog();
  // 상품 등록 실패 스낵바
  const failSnack = useDialog();

  return (
    <div className={classes.container}>
      <Button color="primary" variant="outlined" onClick={merchandiseUploadDialog.handleOpen}>
        + 새 상품 등록
      </Button>

      <MerchandiseUploadDialog
        open={merchandiseUploadDialog.open}
        onClose={merchandiseUploadDialog.handleClose}
        onSuccess={() => {
          successSnack.handleOpen();
          merchandiseUploadDialog.handleClose();
          merchandiseData.requestWithoutConcat();
        }}
        onFail={() => {
          failSnack.handleOpen();
        }}
      />

      <Snackbar
        message="상품 등록을 완료하였습니다."
        open={successSnack.open}
        onClose={successSnack.handleClose}
      />
      <Snackbar
        message="상품 등록 과정에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        open={failSnack.open}
        onClose={failSnack.handleClose}
      />
    </div>
  );
}
