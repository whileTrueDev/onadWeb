// @material-ui/icons
import Dashboard from '@material-ui/icons/Dashboard';
import Person from '@material-ui/icons/Person';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import BubbleChart from '@material-ui/icons/BubbleChart';
import Notifications from '@material-ui/icons/Notifications';
import TableChart from '@material-ui/icons/TableChart';
import AttachMoney from '@material-ui/icons/AttachMoney';
// core components/views for Creator's dashboard layout
import creatorUserProfile from './views/creator/UserProfile/UserProfile';
import creatorTableList from './views/material-ui/TableList/TableList';
import IncomeManage from './views/creator/IncomeManage/IncomeManege';
import creatorTypography from './views/material-ui/Typography/Typography';
import creatorIcons from './views/material-ui/Icons/Icons';
import creatorNotificationsPage from './views/material-ui/Notifications/Notifications';
import creatorDashboardPage from './views/creator/Dashboard/Dashboard';
// 마케터 라우터
import marketerDashboardPage from './views/marketer/Dashboard/Dashboard';


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
    {
      path: '/table',
      name: '테이블 모음집',
      icon: TableChart,
      component: creatorTableList,
      layout: '/dashboard',
    },
    {
      path: '/typography',
      name: '글씨 모음집',
      icon: LibraryBooks,
      component: creatorTypography,
      layout: '/dashboard',
    },
    {
      path: '/icons',
      name: '아이콘',
      icon: BubbleChart,
      component: creatorIcons,
      layout: '/dashboard',
    },
    {
      path: '/notifications',
      name: '알림 모음',
      icon: Notifications,
      component: creatorNotificationsPage,
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
    // 라우팅 추가
  ],
};

export default dashboardRoutes;
