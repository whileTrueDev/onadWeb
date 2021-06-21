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
import CreatorMyAds from './creator/campaign/CampaignManage';
import CreatorCPSManage from './creator/campaign/CPSManage';
import CreatorProgressedCampaigns from './creator/campaign/ProgressedCampaigns';
import CreatorDashboard from './creator/Dashboard';
import CreatorIncomeManage from './creator/IncomeManage';
import CreatorManual from './creator/Manual';
import CreatorMyPage from './creator/Mypage';
import CreatorReferralCodeManage from './creator/ReferralCodeManage';
// import CreatorCPAManage from './creator/CPAManage';
// 마케터 라우터
import MarketerCampaign from './marketer/AdManage/Campaign';
import MarketerInventory from './marketer/AdManage/Inventory';
import MarketerOrders from './marketer/AdManage/Orders';
import MarketerCreateCampaign from './marketer/CampaignCreate';
import MarketerDashboard from './marketer/Dashboard';
import MarketerManual from './marketer/Manual';
import MarketerMyInfo from './marketer/MyInfo';
import MyOfficeCashManage from './marketer/MyOffice/CashManage';
import MyOfficeSettlementManage from './marketer/MyOffice/SettlementManage';
// shared 라우터
import Notice from './shared/Notice';

export interface RouteBase {
  path: string;
  name: string;
  component?: () => JSX.Element;
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
      component: CreatorDashboard,
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
          component: CreatorMyAds,
        },
        {
          path: '/cps',
          name: '판매형 광고 관리',
          component: CreatorCPSManage,
        },
        {
          path: '/progressed',
          name: '진행한 광고목록',
          component: CreatorProgressedCampaigns,
        },
      ],
    },
    {
      path: '/income',
      name: '내 수익 관리',
      icon: AttachMoneyIcon,
      component: CreatorIncomeManage,
      layout: '/mypage/creator',
      // needNextDivider: true,
    },
    {
      path: '/referral-code',
      name: '내 추천인코드',
      icon: HowToReg,
      component: CreatorReferralCodeManage,
      layout: '/mypage/creator',
      needNextDivider: true,
    },
    {
      path: '/user',
      name: '내 계정 관리',
      icon: Person,
      component: CreatorMyPage,
      layout: '/mypage/creator',
      needNextDivider: true,
    },
    {
      path: '/notice',
      name: '공지사항',
      icon: SpeakerNotes,
      component: Notice,
      layout: '/mypage/creator',
    },
    {
      path: '/manual',
      name: '사용 방법',
      icon: Reorder,
      component: CreatorManual,
      layout: '/mypage/creator',
    },
  ],
  marketer: [
    {
      path: '/main',
      name: '대시보드',
      icon: Dashboard,
      component: MarketerDashboard, // 마케터 대시보드 컴포넌트로 수정
      layout: '/mypage/marketer',
    },
    {
      path: '/inventory',
      name: '내 광고 관리',
      icon: BrandingWatermark,
      layout: '/mypage/marketer',
      needNextDivider: true,
      hasSubRoutes: true,
      subRoutes: [
        {
          path: '/campaigns',
          name: '캠페인 관리',
          component: MarketerCampaign,
        },
        {
          path: '/inventory',
          name: '광고 인벤토리',
          component: MarketerInventory,
        },
        {
          path: '/orders',
          name: '주문 관리',
          component: MarketerOrders,
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
          component: MyOfficeCashManage,
          name: '광고 캐시',
        },
        {
          path: '/settlement',
          component: MyOfficeSettlementManage,
          name: '판매 대금',
        },
      ],
    },
    {
      path: '/user',
      name: '내 계정 관리',
      icon: Person,
      component: MarketerMyInfo,
      layout: '/mypage/marketer',
      needNextDivider: true,
    },
    {
      path: '/notice',
      name: '공지사항',
      icon: SpeakerNotes,
      component: Notice,
      layout: '/mypage/marketer',
    },
    {
      path: '/manual',
      name: '사용 방법',
      icon: Reorder,
      component: MarketerManual, // 마케터 대시보드 컴포넌트로 수정
      layout: '/mypage/marketer',
    },
    {
      path: '/campaigncreate',
      name: '캠페인생성',
      icon: Work,
      component: MarketerCreateCampaign,
      layout: '/mypage/marketer',
      noTab: true,
    },
  ],
};

export default dashboardRoutes;
