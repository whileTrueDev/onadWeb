import { Paper, Typography } from '@material-ui/core';
import React from 'react';
import OrderInventory from '../shared/merchandiseOrder/OrderInventory';

export default function OrderList(): React.ReactElement {
  return (
    <Paper style={{ minHeight: 220 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 16 }}>
        <Typography variant="h6">
          상품 주문 현황
        </Typography>
      </div>

      <OrderInventory by="marketer" height={345} withoutTitle />

    </Paper>
  );
}
