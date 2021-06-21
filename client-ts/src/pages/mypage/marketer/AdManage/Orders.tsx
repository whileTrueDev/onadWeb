import { Paper } from '@material-ui/core';
import React from 'react';
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import OrderInventory from '../../../../organisms/mypage/marketer/shared/merchandiseOrder/OrderInventory';

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
