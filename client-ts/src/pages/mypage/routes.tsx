// 라우터 아이콘 @material-ui/icons
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import Dashboard from '@material-ui/icons/DashboardOutlined';
import Person from '@material-ui/icons/PersonOutline';
import BrandingWatermark from '@material-ui/icons/BrandingWatermarkOutlined';
import Reorder from '@material-ui/icons/Reorder';
import Work from '@material-ui/icons/Work';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import SpeakerNotes from '@material-ui/icons/SpeakerNotes';
// 크리에이터 라우터
import { HowToReg } from '@material-ui/icons';
import CreatorMyAds from './creator/CampaignManage';
import CreatorDashboard from './creator/Dashboard';
import CreatorManual from './creator/Manual';
import CreatorMyPage from './creator/Mypage';
// import CreatorCPAManage from './creator/CPAManage';
// 마케터 라우터
import MarketerInventory from './marketer/Inventory';
import MarketerDashboard from './marketer/Dashboard';
import MarketerMyOffice from './marketer/MyOffice';
import MarketerMyInfo from './marketer/MyInfo';
import MarketerCreateCampaign from './marketer/CampaignCreate';
import MarketerManual from './marketer/Manual';
import CreatorIncomeManage from './creator/IncomeManage';
import CreatorReferralCodeManage from './creator/ReferralCodeManage';
// shared 라우터
import Notice from './shared/Notice';

export interface MypageRoute {
  path: string;
  name: string;
  icon: (props: SvgIconProps) => JSX.Element;
  component?: () => JSX.Element;
  layout: string;
  noTab?: boolean;
  needNextDivider?: boolean;
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
      component: CreatorMyAds,
      layout: '/mypage/creator',
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
      component: MarketerInventory, // 마케터 대시보드 컴포넌트로 수정
      layout: '/mypage/marketer',
      needNextDivider: true,
    },
    {
      path: '/myoffice',
      name: '내 오피스',
      icon: Work,
      component: MarketerMyOffice,
      layout: '/mypage/marketer',
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
      noTab: true
    },
  ],
};

export default dashboardRoutes;
