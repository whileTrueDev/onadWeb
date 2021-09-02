import GridContainer from '../../../atoms/grid/gridContainer';
import GridItem from '../../../atoms/grid/gridItem';
import PlatformLinkCard from '../../../components/mypage/creator/user/platformLinkCard';
import ProfileCard from '../../../components/mypage/creator/user/profileCard';
import DashboardLayout from '../../../components/mypage/layouts/creatorDashboardLayout';

const Mypage = (): JSX.Element => {
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

Mypage.layout = DashboardLayout;
