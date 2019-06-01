// 라우터 아이콘 @material-ui/icons
import Dashboard from '@material-ui/icons/Dashboard';
import Person from '@material-ui/icons/Person';
import AttachMoney from '@material-ui/icons/AttachMoney';
import BrandingWatermark from '@material-ui/icons/BrandingWatermark';

// 크리에이터 라우터
import creatorUserProfile from './views/creator/UserProfile/UserProfile';
import IncomeManage from './views/creator/IncomeManage/IncomeManage';
import creatorDashboardPage from './views/creator/Dashboard/Dashboard';
// // 사용하지 않으나, 가져와 사용가능한 라우터들
// import creatorTableList from './views/material-ui/TableList/TableList';
// import creatorTypography from './views/material-ui/Typography/Typography';
// import creatorIcons from './views/material-ui/Icons/Icons';
// import creatorNotificationsPage from './views/material-ui/Notifications/Notifications';
// import LibraryBooks from '@material-ui/icons/LibraryBooks';
// import BubbleChart from '@material-ui/icons/BubbleChart';
// import Notifications from '@material-ui/icons/Notifications';
// import TableChart from '@material-ui/icons/TableChart';

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
      layout: '/dashboard',
    },
    {
      path: '/income',
      name: '수익 관리',
      icon: AttachMoney,
      component: IncomeManage,
      layout: '/dashboard',
    },
    {
      path: '/user',
      name: '계정 관리',
      icon: Person,
      component: creatorUserProfile,
      layout: '/dashboard',
    },
  ],
  marketer: [
    {
      path: '/main',
      name: '대시보드',
      icon: Dashboard,
      component: marketerDashboardPage, // 마케터 대시보드 컴포넌트로 수정
      layout: '/dashboard',
    },
    {
      path: '/banner',
      name: '배너 관리',
      icon: BrandingWatermark,
      component: marketerBannerManage, // 마케터 대시보드 컴포넌트로 수정
      layout: '/dashboard',
    },
    {
      path: '/cash',
      name: '광고캐시 관리',
      icon: AttachMoney,
      component: marketerCashManage, // 마케터 대시보드 컴포넌트로 수정
      layout: '/dashboard',
    },
    {
      path: '/user',
      name: '계정 관리',
      icon: Person,
      component: marketerUserProfile, // 마케터 대시보드 컴포넌트로 수정
      layout: '/dashboard',
    },
  ],
};

export default dashboardRoutes;
