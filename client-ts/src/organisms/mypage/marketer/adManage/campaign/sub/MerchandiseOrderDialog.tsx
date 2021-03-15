import classnames from 'classnames';
import {
  Button, Chip, CircularProgress, makeStyles, Typography
} from '@material-ui/core';
import React, { useContext, useMemo } from 'react';
import SwipeableTextMobileStepper from '../../../../../../atoms/Carousel/Carousel';
import CustomDialog from '../../../../../../atoms/Dialog/Dialog';
import MarketerInfoContext from '../../../../../../context/MarketerInfo.context';
import { getS3MerchandiseImagePath } from '../../../../../../utils/aws/getS3Path';
import { useGetRequest } from '../../../../../../utils/hooks';
import renderOrderStatus, {
  주문상태_출고준비완료, 주문상태_상품준비중
} from '../../../../../../utils/render_funcs/renderOrderStatus';
import { Merchandise, MerchandiseOrder } from '../../interface';

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

export interface MerchandiseDetailDialogProps {
  merchandiseOrder: MerchandiseOrder;
  open: boolean;
  onClose: () => void;
}
function MerchandiseOrderDialog({
  merchandiseOrder,
  open,
  onClose,
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


  return (
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
            {merchandiseOrder.additionalPrice && `(+${merchandiseOrder.additionalPrice.toLocaleString()})`}
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
            >
              상품준비중 상태로 변경
            </Button>
            <Button
              className={classnames(classes.success, classes.actionbutton)}
              variant="contained"
              disabled={stockLeft === 0}
            >
              출고준비완료 상태로 변경
            </Button>
            <Button
              className={classnames(classes.error, classes.actionbutton)}
              variant="contained"
            >
              주문취소
            </Button>
          </div>
          <Button fullWidth variant="contained" onClick={onClose}>닫기</Button>
        </>
      )}
    </CustomDialog>
  );
}

export default MerchandiseOrderDialog;
