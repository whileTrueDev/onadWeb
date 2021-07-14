import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import PlatformLinkCard from '../../../organisms/mypage/creator/Mypage/PlatformLinkCard';
import ProfileCard from '../../../organisms/mypage/creator/Mypage/ProfileCard';
import useMypageScrollToTop from '../../../utils/hooks/useMypageScrollToTop';

const Mypage = (): JSX.Element => {
  useMypageScrollToTop();

  return (
    <div style={{ margin: '0 auto', maxWidth: 1024 }}>
      <GridContainer direction="row">
        <GridItem xs={12}>
          <PlatformLinkCard />
        </GridItem>
        <GridItem xs={12}>
          <ProfileCard />
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default Mypage;
