import React from 'react';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import InventoryManage from '../../../organisms/mypage/marketer/inventory/InventoryManage';


const Inventory = (): JSX.Element => (
  <GridContainer>

    <GridItem xs={12}>
      <InventoryManage />
    </GridItem>

  </GridContainer>

);

export default Inventory;
