// 라우터 아이콘 @material-ui/icons
import Dashboard from '@material-ui/icons/Dashboard';
import Person from '@material-ui/icons/Person';
import AttachMoney from '@material-ui/icons/AttachMoney';
import BrandingWatermark from '@material-ui/icons/BrandingWatermark';

// 크리에이터 라우터
import creatorUserProfile from './views/creator/UserProfile/UserProfile';
import IncomeManage from './views/creator/IncomeManage/IncomeManage';
import creatorDashboardPage from './views/creator/Dashboard/Dashboard';
import creatorManual from './views/creator/CreatorManual/CreatorManual'

// 마케터 라우터
import marketerDashboardPage from './views/marketer/Dashboard/Dashboard';
import marketerBannerManage from './views/marketer/BannerManage/BannerManage';
import marketerCashManage from './views/marketer/CashManage/CashManage';
import marketerUserProfile from './views/marketer/UserProfile/UserProfile';


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
      path: '/user',
      name: '계정 관리',
      icon: Person,
      component: creatorUserProfile,
      layout: '/dashboard/creator',
    },
    {
      path: '/creatormanual',
      name: '사용 방법',
      icon: Person,
      component: creatorManual,
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
      path: '/cash',
      name: '광고캐시 관리',
      icon: AttachMoney,
      component: marketerCashManage, // 마케터 대시보드 컴포넌트로 수정
      layout: '/dashboard/marketer',
    },
    {
      path: '/user',
      name: '계정 관리',
      icon: Person,
      component: marketerUserProfile, // 마케터 대시보드 컴포넌트로 수정
      layout: '/dashboard/marketer',
    },
  ],
};

export default dashboardRoutes;
