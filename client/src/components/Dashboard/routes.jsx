// 라우터 아이콘 @material-ui/icons
import Dashboard from '@material-ui/icons/Dashboard';
import Person from '@material-ui/icons/Person';
import AttachMoney from '@material-ui/icons/AttachMoney';
import BrandingWatermark from '@material-ui/icons/BrandingWatermark';
import Reorder from '@material-ui/icons/Reorder';
import Work from '@material-ui/icons/Work';

// 크리에이터 라우터
import creatorUserProfile from './views/creator/UserProfile/UserProfile';
import IncomeManage from './views/creator/IncomeManage/IncomeManage';
import creatorDashboardPage from './views/creator/Dashboard/Dashboard';
import creatorManual from './views/creator/Manual/Manual';

// 마케터 라우터
import marketerDashboardPage from './views/marketer/Dashboard/Dashboard';
import marketerBannerManage from './views/marketer/BannerManage/BannerManage';
import MarketerManual from './views/marketer/Manual/Manual';
import marketerMyOffice from './views/marketer/MyOffice/MyOffice';

const dashboardRoutes = {
  creator: [
    {
      path: '/main',
      name: '대시보드',
      icon: Dashboard,
      component: creatorDashboardPage,
      layout: '/dashboard/creator',
    },
    {
      path: '/income',
      name: '수익 관리',
      icon: AttachMoney,
      component: IncomeManage,
      layout: '/dashboard/creator',
    },
    {
      path: '/manual',
      name: '사용 방법',
      icon: Reorder,
      component: creatorManual,
      layout: '/dashboard/creator',
    },
    {
      path: '/user',
      name: '계정 관리',
      icon: Person,
      component: creatorUserProfile,
      layout: '/dashboard/creator',
    },
  ],
  marketer: [
    {
      path: '/main',
      name: '대시보드',
      icon: Dashboard,
      component: marketerDashboardPage, // 마케터 대시보드 컴포넌트로 수정
      layout: '/dashboard/marketer',
    },
    {
      path: '/banner',
      name: '배너 관리',
      icon: BrandingWatermark,
      component: marketerBannerManage, // 마케터 대시보드 컴포넌트로 수정
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
      component: marketerMyOffice,
      layout: '/dashboard/marketer'
    },
  ],
};

export default dashboardRoutes;
