import GridContainer from '../../../../atoms/grid/gridContainer';
import GridItem from '../../../../atoms/grid/gridItem';
import InventoryManage from '../../../../components/mypage/marketer/adManage/inventoryManage';
import DashboardLayout from '../../../../components/mypage/layouts/marketerDashboardLayout';

const Inventroy = (): JSX.Element => {
  return (
    <GridContainer>
      <GridItem xs={12}>
        <InventoryManage />
      </GridItem>
    </GridContainer>
  );
};

export default Inventroy;

Inventroy.layout = DashboardLayout;
