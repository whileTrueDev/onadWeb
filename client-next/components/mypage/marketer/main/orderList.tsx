import * as React from 'react';
import { Button, Paper, Typography } from '@material-ui/core';
import Router from 'next/router';
import OrderInventory from '../shared/merchandiseOrder/orderInventory';

export default function OrderList(): React.ReactElement {
  return (
    <Paper style={{ minHeight: 220 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 16 }}>
        <Typography variant="h6">상품 주문 현황</Typography>

        <Button
          variant="outlined"
          size="small"
          color="primary"
          onClick={() => {
            Router.push('/mypage/marketer/inventory/orders');
          }}
        >
          더보기
        </Button>
      </div>

      <OrderInventory by="marketer" height={345} withoutTitle />
    </Paper>
  );
}
