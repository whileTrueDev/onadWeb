import * as React from 'react';
import { Button, Paper, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import OrderInventory from '../shared/merchandiseOrder/OrderInventory';

export default function OrderList(): React.ReactElement {
  const history = useHistory();
  return (
    <Paper style={{ minHeight: 220 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 16 }}>
        <Typography variant="h6">상품 주문 현황</Typography>

        <Button
          variant="outlined"
          size="small"
          color="primary"
          onClick={(): void => {
            history.push('/mypage/marketer/inventory/orders');
          }}
        >
          더보기
        </Button>
      </div>

      <OrderInventory by="marketer" height={345} withoutTitle />
    </Paper>
  );
}
