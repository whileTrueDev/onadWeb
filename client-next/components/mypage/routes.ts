// 라우터 아이콘 @material-ui/icons
import { SvgIconProps } from '@material-ui/core/SvgIcon';
// 크리에이터 라우터
import { HowToReg } from '@material-ui/icons';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import BrandingWatermark from '@material-ui/icons/BrandingWatermarkOutlined';
import Dashboard from '@material-ui/icons/DashboardOutlined';
import Person from '@material-ui/icons/PersonOutline';
import Reorder from '@material-ui/icons/Reorder';
import SpeakerNotes from '@material-ui/icons/SpeakerNotes';
import Work from '@material-ui/icons/Work';

export interface RouteBase {
  path: string;
  name: string;
}
export interface MypageRoute extends RouteBase {
  icon: (props: SvgIconProps) => JSX.Element;
  layout: string;
  noTab?: boolean;
  needNextDivider?: boolean;
  hasSubRoutes?: boolean;
  subRoutes?: RouteBase[];
}

export interface MypageRoutes {
  creator: MypageRoute[];
  marketer: MypageRoute[];
}

const dashboardRoutes: MypageRoutes = {
  creator: [
    {
      path: '/main',
      name: '대시보드',
      icon: Dashboard,
      layout: '/mypage/creator',
    },
    {
      path: '/ad',
      name: '내 광고 관리',
      icon: BrandingWatermark,
      layout: '/mypage/creator',
      hasSubRoutes: true,
      subRoutes: [
        {
          path: '/campaigns',
          name: '광고 관리',
        },
        {
          path: '/cps',
          name: '판매형 광고 관리',
        },
        {
          path: '/progressed',
          name: '진행한 광고목록',
        },
      ],
    },
    {
      path: '/income',
      name: '내 수익 관리',
      icon: AttachMoneyIcon,
      layout: '/mypage/creator',
      // needNextDivider: true,
    },
    {
      path: '/referral-code',
      name: '내 추천인코드',
      icon: HowToReg,
      layout: '/mypage/creator',
      needNextDivider: true,
    },
    {
      path: '/user',
      name: '내 계정 관리',
      icon: Person,
      layout: '/mypage/creator',
      needNextDivider: true,
    },
    {
      path: '/notice',
      name: '공지사항',
      icon: SpeakerNotes,
      layout: '/mypage/creator',
    },
    {
      path: '/manual',
      name: '사용 방법',
      icon: Reorder,
      layout: '/mypage/creator',
    },
  ],
  marketer: [
    {
      path: '/main',
      name: '대시보드',
      icon: Dashboard,
      layout: '/mypage/marketer',
    },
    {
      path: '/adManage',
      name: '내 광고 관리',
      icon: BrandingWatermark,
      layout: '/mypage/marketer',
      needNextDivider: true,
      hasSubRoutes: true,
      subRoutes: [
        {
          path: '/campaigns',
          name: '캠페인 관리',
        },
        {
          path: '/inventory',
          name: '광고 인벤토리',
        },
        {
          path: '/orders',
          name: '주문 관리',
        },
      ],
    },
    {
      path: '/myoffice',
      name: '내 오피스',
      icon: Work,
      layout: '/mypage/marketer',
      hasSubRoutes: true,
      subRoutes: [
        {
          path: '/cash',
          name: '광고 캐시',
        },
        {
          path: '/settlement',
          name: '판매 대금',
        },
        {
          path: '/tax-bill',
          name: '세금계산서',
        },
      ],
    },
    {
      path: '/user',
      name: '내 계정 관리',
      icon: Person,
      layout: '/mypage/marketer',
      needNextDivider: true,
    },
    {
      path: '/notice',
      name: '공지사항',
      icon: SpeakerNotes,
      layout: '/mypage/marketer',
    },
    {
      path: '/manual',
      name: '사용 방법',
      icon: Reorder,
      layout: '/mypage/marketer',
    },
    {
      path: '/campaign-create',
      name: '캠페인생성',
      icon: Work,
      layout: '/mypage/marketer',
      noTab: true,
    },
  ],
};

export default dashboardRoutes;
