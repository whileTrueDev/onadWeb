import { Chip, makeStyles } from '@material-ui/core';
import classnames from 'classnames';
import { useMemo } from 'react';
import * as React from 'react';
import renderOrderStatus, {
  주문상태_상품준비,
  주문상태_출고준비,
  주문상태_배송완료,
  주문상태_출고완료,
  OrderStatus,
  주문상태_구매확정,
  주문상태_주문취소,
} from '../../utils/render_funcs/renderOrderStatus';

const useStyles = makeStyles(theme => ({
  success: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.success.dark,
    '&:hover': { backgroundColor: theme.palette.success.dark },
  },
  error: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.error.dark,
    '&:hover': { backgroundColor: theme.palette.error.dark },
  },
}));

interface OrderStatusChipProps {
  status: OrderStatus;
}

export default function OrderStatusChip({ status }: OrderStatusChipProps): React.ReactElement {
  const classes = useStyles();

  const color = useMemo(() => {
    if ([주문상태_상품준비, 주문상태_출고준비].includes(status)) return 'secondary';
    if (status === 주문상태_구매확정) return 'primary';
    return 'default';
  }, [status]);

  return (
    <Chip
      size="small"
      label={renderOrderStatus(status)}
      color={color}
      className={classnames({
        [classes.success]: [주문상태_배송완료, 주문상태_출고완료].includes(status),
        [classes.error]: status === 주문상태_주문취소,
      })}
    />
  );
}
