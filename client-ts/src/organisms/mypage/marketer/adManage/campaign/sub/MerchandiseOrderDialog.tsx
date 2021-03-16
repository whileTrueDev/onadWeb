import classnames from 'classnames';
import {
  Button, Chip, CircularProgress, makeStyles, Typography
} from '@material-ui/core';
import React, { useContext, useMemo, useState } from 'react';
import SwipeableTextMobileStepper from '../../../../../../atoms/Carousel/Carousel';
import CustomDialog from '../../../../../../atoms/Dialog/Dialog';
import MarketerInfoContext from '../../../../../../context/MarketerInfo.context';
import { getS3MerchandiseImagePath } from '../../../../../../utils/aws/getS3Path';
import { useDialog, useGetRequest, usePatchRequest } from '../../../../../../utils/hooks';
import renderOrderStatus, {
  주문상태_출고준비완료, 주문상태_상품준비중, 주문상태_주문취소
} from '../../../../../../utils/render_funcs/renderOrderStatus';
import { Merchandise, MerchandiseOrder } from '../../interface';
import Snackbar from '../../../../../../atoms/Snackbar/Snackbar';

const useStyles = makeStyles((theme) => ({
  buttonSet: {
    display: 'flex',
    alignItems: 'stretch',
  },
  success: {
    backgroundColor: theme.palette.success.main,
    '&:hover': { backgroundColor: theme.palette.success.light, },
  },
  error: {
    backgroundColor: theme.palette.error.main,
    '&:hover': { backgroundColor: theme.palette.error.light, },
  },
  actionbutton: {
    margin: theme.spacing(1),
    flex: 1,
    wordBreak: 'keep-all',
  },
}));

export type OrderStatus = typeof 주문상태_상품준비중 | typeof 주문상태_출고준비완료 | typeof 주문상태_주문취소;
export interface MerchandiseDetailDialogProps {
  merchandiseOrder: MerchandiseOrder;
  open: boolean;
  onClose: () => void;
  onStatusChange?: () => void;
  onStatusChangeFail?: () => void;
}
function MerchandiseOrderDialog({
  merchandiseOrder,
  open,
  onClose,
  onStatusChange,
  onStatusChangeFail,
}: MerchandiseDetailDialogProps): React.ReactElement {
  const classes = useStyles();
  const marketerInfo = useContext(MarketerInfoContext);
  const merchandiseDetailGet = useGetRequest<null, Merchandise>(
    `/marketer/merchandises/${merchandiseOrder.merchandiseId}`,
  );

  // S3 상품 이미지 URL을 구하는 함수.
  function getMerchandiseS3Url(imageName: string, merchandiseId: number): string {
    const targetMerchandiseId = String(merchandiseId);
    if (marketerInfo.user) {
      return getS3MerchandiseImagePath(
        marketerInfo.user.marketerId, targetMerchandiseId, imageName
      );
    }
    return imageName;
  }

  // 남은 재고 수량 변수
  const stockLeft = useMemo(
    () => merchandiseOrder.stock - (merchandiseOrder.merchandiseSoldCount || 0),
    [merchandiseOrder.merchandiseSoldCount, merchandiseOrder.stock]
  );

  // 상태 변경 요청 핸들링
  const orderStatusPatch = usePatchRequest('/marketer/orders');
  const snack = useDialog(); // 스낵바
  // 스낵바 내용
  const [snackMsg, setSnackMsg] = useState<{msg: string; color: 'error' | 'success'}>();
  function handleSnackMsg(msg: string, color: 'error' | 'success'): void {
    setSnackMsg({ msg, color });
  }

  const confirmDialog = useDialog();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>();
  function handleStatusSelect(
    status: OrderStatus
  ): void {
    setSelectedStatus(status);
    confirmDialog.handleOpen();
  }
  function handleStatusReset(): void {
    setSelectedStatus(undefined);
  }

  // 상태 변경 요청 함수
  function handleStatusChange(
    status: OrderStatus
  ): void {
    orderStatusPatch.doPatchRequest({ orderId: merchandiseOrder.id, status })
      .then(() => {
        handleSnackMsg(
          '주문 상태를 변경이 완료되었습니다.', 'success'
        );
        snack.handleOpen();
        if (onStatusChange) onStatusChange();
      })
      .catch(() => {
        handleSnackMsg(
          '주문 상태를 변경하는 도중 오류가 발생했습니다. 문제가 지속적으로 발견될 시 support@onad.io로 문의바랍니다.', 'error'
        );
        snack.handleOpen();
        if (onStatusChangeFail) onStatusChangeFail();
      });
  }


  return (
    <>
      <CustomDialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        title="주문 정보"
      >
        {merchandiseDetailGet.loading && (<div style={{ textAlign: 'center', width: '100%' }}><CircularProgress /></div>)}
        {!merchandiseDetailGet.loading && (
          <>
            {merchandiseDetailGet.data && merchandiseDetailGet.data.imagesRes && (
            <SwipeableTextMobileStepper
              images={merchandiseDetailGet.data.imagesRes
                .map((image) => getMerchandiseS3Url(image, merchandiseOrder.merchandiseId))}
            />
            )}
            <Typography>
              {'주문 상태: '}
              <Chip
                size="small"
                label={renderOrderStatus(merchandiseOrder.status)}
                color={merchandiseOrder.status === 주문상태_상품준비중 ? 'primary' : 'default'}
                className={classnames({
                  [classes.success]: merchandiseOrder.status === 주문상태_출고준비완료,
                })}
              />
            </Typography>
            <Typography>{`상품 명: ${merchandiseOrder.name}`}</Typography>
            {merchandiseOrder.optionId && (
            <Typography>
              {`선택 옵션: ${merchandiseOrder.optionType} - ${merchandiseOrder.optionValue}`}
              {merchandiseOrder.additionalPrice ? `(+${merchandiseOrder.additionalPrice.toLocaleString()}원)` : ''}
            </Typography>
            )}
            <Typography>{`주문 수량: ${merchandiseOrder.quantity}`}</Typography>
            <Typography>{`남은 재고: ${stockLeft}`}</Typography>
            <Typography>
              {`총 주문 금액: ${
                (merchandiseOrder.orderPrice
                + (merchandiseOrder.additionalPrice || 0)).toLocaleString()
              } 원`}
            </Typography>

            <div className={classes.buttonSet}>
              <Button
                className={classes.actionbutton}
                variant="contained"
                color="primary"
                disabled={stockLeft === 0}
                onClick={(): void => handleStatusSelect(주문상태_상품준비중)}
              >
              상품준비중 상태로 변경
              </Button>
              <Button
                className={classnames(classes.success, classes.actionbutton)}
                variant="contained"
                disabled={stockLeft === 0}
                onClick={(): void => handleStatusSelect(주문상태_출고준비완료)}
              >
              출고준비완료 상태로 변경
              </Button>
              <Button
                className={classnames(classes.error, classes.actionbutton)}
                variant="contained"
                onClick={(): void => handleStatusSelect(주문상태_주문취소)}
              >
              주문취소
              </Button>
            </div>
            <Button fullWidth variant="contained" onClick={onClose}>닫기</Button>
          </>
        )}
      </CustomDialog>

      {/* 상태변경 확인 다이얼로그 */}
      {selectedStatus && (
      <CustomDialog
        fullWidth
        maxWidth="xs"
        open={confirmDialog.open}
        onClose={() => {
          confirmDialog.handleClose();
          handleStatusReset();
        }}
        buttons={(
          <div>
            <Button variant="contained" color="primary" onClick={(): void => handleStatusChange(selectedStatus)}>확인</Button>
            <Button variant="contained" onClick={confirmDialog.handleClose}>취소</Button>
          </div>
        )}
      >
        <div style={{ textAlign: 'center' }}>
          <Typography>
            {`${merchandiseOrder.name}의 상태를 ${renderOrderStatus(selectedStatus)}로 변경하시겠습니까?`}
          </Typography>
        </div>
      </CustomDialog>
      )}

      {snackMsg && (
      <Snackbar
        message={snackMsg.msg}
        open={snack.open}
        onClose={snack.handleClose}
        color={snackMsg.color}
      />
      )}
    </>
  );
}

export default MerchandiseOrderDialog;
