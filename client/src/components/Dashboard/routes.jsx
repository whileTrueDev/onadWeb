// @material-ui/icons
import Dashboard from '@material-ui/icons/Dashboard';
import Person from '@material-ui/icons/Person';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import BubbleChart from '@material-ui/icons/BubbleChart';
import Notifications from '@material-ui/icons/Notifications';
// core components/views for dashboard layout
import UserProfile from './views/UserProfile/UserProfile';
import TableList from './views/TableList/TableList';
import Typography from './views/Typography/Typography';
import Icons from './views/Icons/Icons';
import NotificationsPage from './views/Notifications/Notifications';
// core components/./views for RTL layout
import DashboardPage from './views/Dashboard/Dashboard';

const dashboardRoutes = [
  {
    path: '/main',
    name: '대시보드',
    icon: Dashboard,
    component: DashboardPage,
    layout: '/dashboard',
  },
  {
    path: '/user',
    name: '계정관리',
    icon: Person,
    component: UserProfile,
    layout: '/dashboard',
  },
  {
    path: '/table',
    name: '테이블 모음집',
    icon: 'content_paste',
    component: TableList,
    layout: '/dashboard',
  },
  {
    path: '/typography',
    name: '글씨 모음집',
    icon: LibraryBooks,
    component: Typography,
    layout: '/dashboard',
  },
  {
    path: '/icons',
    name: '아이콘',
    icon: BubbleChart,
    component: Icons,
    layout: '/dashboard',
  },
  {
    path: '/notifications',
    name: '알림',
    icon: Notifications,
    component: NotificationsPage,
    layout: '/dashboard',
  },
];

export default dashboardRoutes;
