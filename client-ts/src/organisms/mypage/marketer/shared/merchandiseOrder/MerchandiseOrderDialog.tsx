import {
  Button, CircularProgress, Divider, makeStyles, Tooltip, Typography
} from '@material-ui/core';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import classnames from 'classnames';
import React, { useContext, useMemo, useState } from 'react';
import SwipeableTextMobileStepper from '../../../../../atoms/Carousel/Carousel';
import OrderStatusChip from '../../../../../atoms/Chip/OrderStatusChip';
import DataText from '../../../../../atoms/DataText/DataText';
import CustomDialog from '../../../../../atoms/Dialog/Dialog';
import Snackbar from '../../../../../atoms/Snackbar/Snackbar';
import MarketerInfoContext from '../../../../../context/MarketerInfo.context';
import { getS3MerchandiseImagePath } from '../../../../../utils/aws/getS3Path';
import { useDialog, useGetRequest, usePatchRequest } from '../../../../../utils/hooks';
import {
  OrderStatus, 주문상태_상품준비, 주문상태_주문취소, 주문상태_출고완료, 주문상태_출고준비
} from '../../../../../utils/render_funcs/renderOrderStatus';
import { Merchandise, MerchandiseOrder } from '../../adManage/interface';
import OrderStateChangeDialog, { OrderCourierDTO } from './OrderStateChangeDialog';

const useStyles = makeStyles((theme) => ({
  buttonSet: {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    margin: theme.spacing(1, 0),
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
    // margin: theme.spacing(1),
  },
  bold: { fontWeight: 'bold' },
}));

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
  // onStatusChangeFail,
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
  const availableStock = useMemo(
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
  type StatusChangeParams = { status: OrderStatus; dto?: OrderCourierDTO; denialReason?: string };
  function handleStatusChange({
    status, dto, denialReason
  }: StatusChangeParams): void {
    orderStatusPatch.doPatchRequest({
      orderId: merchandiseOrder.id,
      status,
      denialReason,
      courierCompany: dto ? dto.courierCompany : null,
      trackingNumber: dto ? dto.trackingNumber : null,
    })
      .then(() => {
        handleSnackMsg(
          '주문 상태를 변경이 완료되었습니다.', 'success'
        );
        snack.handleOpen();
        confirmDialog.handleClose();
        if (onStatusChange) onStatusChange();
      })
      .catch((err) => {
        console.error(err);
        handleSnackMsg(
          '주문 상태를 변경하는 도중 오류가 발생했습니다. 문제가 지속적으로 발견될 시 support@onad.io로 문의바랍니다.', 'error'
        );
        snack.handleOpen();
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
            <DataText name="상품 명" value={merchandiseOrder.name} />
            {merchandiseOrder.optionId && (
            <DataText
              name="선택 옵션"
              value={(
                <Typography component="span">
                  {`${merchandiseOrder.optionType} - ${merchandiseOrder.optionValue}`}
                  {merchandiseOrder.additionalPrice ? `(+${merchandiseOrder.additionalPrice.toLocaleString()}원)` : ''}
                </Typography>
              )}
            />
            )}
            <DataText name="주문 수량" value={merchandiseOrder.quantity} />
            <DataText name="남은 상품 재고" value={availableStock} />
            <DataText
              name="총 주문 금액"
              value={`${
                (merchandiseOrder.orderPrice
                + (merchandiseOrder.additionalPrice || 0)).toLocaleString()
              } 원`}
            />

            <Divider />

            <DataText name="주문자 이메일" value={merchandiseOrder.email} />
            <DataText name="받는분" value={merchandiseOrder.recipientName} />
            <DataText name="전화번호" value={merchandiseOrder.phone} />
            <DataText name="우편번호" value={merchandiseOrder.zoneCode} />
            <DataText name="도로명 주소" value={merchandiseOrder.roadAddress} />
            <DataText name="지번 주소" value={merchandiseOrder.jibunAddress} />
            {merchandiseOrder.deliveryMemo ? (
              <DataText name="배송 메모" value={merchandiseOrder.deliveryMemo} />
            ) : null}

            <Divider />

            <DataText
              name="주문상태"
              value={(
                <OrderStatusChip status={merchandiseOrder.status} />
              )}
            />
            {merchandiseOrder.releaseId && (
              <DataText
                iconComponent={LocalShippingIcon}
                iconColor="success"
                name="출고 정보"
                value={`${merchandiseOrder.courierCompany} ${merchandiseOrder.trackingNumber}`}
              />
            )}
            <Typography className={classes.bold}>상태변경</Typography>
            <Typography color="error" variant="body2">변경한 상태는 되돌릴 수 없습니다.</Typography>
            <Typography color="error" variant="body2">주문취소는 주문접수 상태에서만 가능합니다.</Typography>

            <div className={classes.buttonSet}>
              <Button
                className={classes.actionbutton}
                variant="contained"
                color="secondary"
                disabled={availableStock === 0 || merchandiseOrder.status >= 주문상태_상품준비}
                onClick={(): void => handleStatusSelect(주문상태_상품준비)}
              >
                상품준비
              </Button>
              <Button
                className={classes.actionbutton}
                color="secondary"
                variant="contained"
                disabled={availableStock === 0 || merchandiseOrder.status >= 주문상태_출고준비}
                onClick={(): void => handleStatusSelect(주문상태_출고준비)}
              >
                출고준비
              </Button>
              <Button
                className={classnames(classes.success, classes.actionbutton)}
                variant="contained"
                disabled={availableStock === 0 || merchandiseOrder.status >= 주문상태_출고완료}
                onClick={(): void => handleStatusSelect(주문상태_출고완료)}
              >
                출고완료
              </Button>
              <Tooltip title="주문취소는 되돌릴 수 없습니다.">
                <div>
                  <Button
                    className={classnames(classes.error, classes.actionbutton)}
                    variant="contained"
                    onClick={(): void => handleStatusSelect(주문상태_주문취소)}
                    disabled={merchandiseOrder.status !== 0}
                  >
                  주문취소
                  </Button>
                </div>
              </Tooltip>
            </div>
            <Button fullWidth variant="contained" onClick={onClose}>닫기</Button>
          </>
        )}
      </CustomDialog>

      {/* 상태변경 확인 다이얼로그 */}
      {selectedStatus && (
        <OrderStateChangeDialog
          open={confirmDialog.open}
          onClose={(): void => {
            confirmDialog.handleClose();
            handleStatusReset();
          }}
          onClick={handleStatusChange}
          merchandiseOrder={merchandiseOrder}
          selectedStatus={selectedStatus}
        />
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
