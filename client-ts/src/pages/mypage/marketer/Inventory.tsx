import React from 'react';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import InventoryManage from '../../../organisms/mypage/marketer/inventory/InventoryManage';
import SelectedInventoryItem from '../../../organisms/mypage/marketer/inventory/SelectedInventoryItem';


const Inventory = (): JSX.Element => {
  const [selectedItem, setSelected] = React.useState<string>('');
  function handleItemSelect(item: string): void {
    setSelected(item);
  }
  return (
    <GridContainer>

      <GridItem xs={12}>
        <InventoryManage handleItemSelect={handleItemSelect} />
      </GridItem>

      <GridItem xs={12}>
        <SelectedInventoryItem selectedItem={selectedItem} />
      </GridItem>

    </GridContainer>

  );
};


export default Inventory;
