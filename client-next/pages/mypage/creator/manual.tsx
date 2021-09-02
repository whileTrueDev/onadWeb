import GridItem from '../../../atoms/grid/gridItem';
import GridContainer from '../../../atoms/grid/gridContainer';
import ManualContents from '../../../components/mypage/shared/manual/manualContents';
import DashboardLayout from '../../../components/mypage/layouts/creatorDashboardLayout';

function CreatorManual(): JSX.Element {
  return (
    <div style={{ margin: '0 auto', maxWidth: 1430 }}>
      <GridContainer>
        <GridItem xs={12}>
          <ManualContents type="creator" />
        </GridItem>
      </GridContainer>
    </div>
  );
}
export default CreatorManual;

CreatorManual.layout = DashboardLayout;
