import GridItem from '../../../atoms/Grid/GridItem';
import GridContainer from '../../../atoms/Grid/GridContainer';
import ManualContents from '../../../organisms/mypage/shared/ManualContents';
import useMypageScrollToTop from '../../../utils/hooks/useMypageScrollToTop';

function CreatorManual(): JSX.Element {
  useMypageScrollToTop();
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
