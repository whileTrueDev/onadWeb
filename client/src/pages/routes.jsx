// 라우터 아이콘 @material-ui/icons
import Dashboard from '@material-ui/icons/DashboardOutlined';
import Person from '@material-ui/icons/PersonOutline';
import BrandingWatermark from '@material-ui/icons/BrandingWatermarkOutlined';
import Reorder from '@material-ui/icons/Reorder';
import Work from '@material-ui/icons/Work';
import Public from '@material-ui/icons/Public';
// import Public from '@material-ui/icons/Public'; // 지구본 아이콘

// 크리에이터 라우터
import CreatorBannerManage from './creator/BannerManage';
import CreatorLandingManage from './creator/LandingManage';
import CreatorDashboard from './creator/Dashboard';
// 수정필요함.
import CreatorMyPage from '../organisms/creator/Mypage/Mypage';
import CreatorManual from './creator/Manual';
import UserProfile from './creator/UserProfile';

// 마케터 라우터
import MarketerDashboard from './marketer/Dashboard';
import MarketerBannerManage from './marketer/BannerManage';
import MarketerManual from './marketer/Manual';
import MarketerMyOffice from './marketer/MyOffice';

const dashboardRoutes = {
  creator: [
    {
      path: '/main',
      name: '대시보드',
      icon: Dashboard,
      component: CreatorDashboard,
      layout: '/dashboard/creator',
    },
    {
      path: '/banner',
      name: '내 배너',
      icon: BrandingWatermark,
      component: CreatorBannerManage, // 마케터 대시보드 컴포넌트로 수정
      layout: '/dashboard/creator',
    },
    {
      path: '/landing',
      name: '내 광고페이지',
      icon: Public,
      component: CreatorLandingManage,
      layout: '/dashboard/creator',
    },
    {
      path: '/manual',
      name: '사용 방법',
      icon: Reorder,
      component: CreatorManual,
      layout: '/dashboard/creator',
    },
    {
      path: '/user1',
      name: '계정 관리 - 찬우',
      icon: Person,
      component: CreatorMyPage,
      layout: '/dashboard/creator',
    },
    {
      path: '/user2',
      name: '계정 관리 - 진은',
      icon: Person,
      component: UserProfile,
      layout: '/dashboard/creator',
    },
  ],
  marketer: [
    {
      path: '/main',
      name: '대시보드',
      icon: Dashboard,
      component: MarketerDashboard, // 마케터 대시보드 컴포넌트로 수정
      layout: '/dashboard/marketer',
    },
    {
      path: '/banner',
      name: '내 배너',
      icon: BrandingWatermark,
      component: MarketerBannerManage, // 마케터 대시보드 컴포넌트로 수정
      layout: '/dashboard/marketer',
    },
    {
      path: '/manual',
      name: '사용 방법',
      icon: Reorder,
      component: MarketerManual, // 마케터 대시보드 컴포넌트로 수정
      layout: '/dashboard/marketer',
    },
    {
      path: '/myoffice',
      name: '내 오피스',
      icon: Work,
      component: MarketerMyOffice,
      layout: '/dashboard/marketer'
    },
  ],
};

export default dashboardRoutes;
