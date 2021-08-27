import { Paper } from '@material-ui/core';
import * as React from 'react';
import GridContainer from '../../../../atoms/grid/gridContainer';
import GridItem from '../../../../atoms/grid/gridItem';
import OrderInventory from '../../../../components/mypage/marketer/shared/merchandiseOrder/orderInventory';
import DashboardLayout from '../../../../components/mypage/layouts/marketerDashboardLayout';

export default function Orders(): React.ReactElement {
  return (
    <GridContainer>
      <GridItem xs={12}>
        <Paper style={{ padding: 16 }}>
          <OrderInventory by="marketer" />
        </Paper>
      </GridItem>
    </GridContainer>
  );
}

Orders.layout = DashboardLayout;
