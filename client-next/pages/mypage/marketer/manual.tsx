import GridContainer from '../../../atoms/grid/gridContainer';
import GridItem from '../../../atoms/grid/gridItem';
import ManualContents from '../../../components/mypage/shared/manual/manualContents';
import DashboardLayout from '../../../components/mypage/layouts/marketerDashboardLayout';

const MarketerManual = (): JSX.Element => {
  return (
    <div style={{ margin: '0 auto', maxWidth: 1430 }}>
      <GridContainer>
        <GridItem xs={12}>
          <ManualContents type="marketer" />
        </GridItem>
      </GridContainer>
    </div>
  );
};
export default MarketerManual;

MarketerManual.layout = DashboardLayout;
