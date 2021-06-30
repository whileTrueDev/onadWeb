import GridItem from '../../../atoms/Grid/GridItem';
import GridContainer from '../../../atoms/Grid/GridContainer';
import ManualContents from '../../../organisms/mypage/shared/ManualContents';
import { useGetRequest } from '../../../utils/hooks';
import useMypageScrollToTop from '../../../utils/hooks/useMypageScrollToTop';

function CreatorManual(): JSX.Element {
  const manualGet = useGetRequest('/manual', { type: 'creator' });

  useMypageScrollToTop();
  return (
    <div style={{ margin: '0 auto', maxWidth: 1430 }}>
      <GridContainer>
        <GridItem xs={12}>
          <ManualContents manualGet={manualGet} />
        </GridItem>
      </GridContainer>
    </div>
  );
}
export default CreatorManual;
