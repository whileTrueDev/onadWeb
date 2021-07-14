import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import ManualContents from '../../../organisms/mypage/shared/ManualContents';
import useMypageScrollToTop from '../../../utils/hooks/useMypageScrollToTop';

const MarketerManual = (): JSX.Element => {
  useMypageScrollToTop();
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
