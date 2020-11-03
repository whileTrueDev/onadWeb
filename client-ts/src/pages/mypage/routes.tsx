// 라우터 아이콘 @material-ui/icons
import React from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import Dashboard from '@material-ui/icons/DashboardOutlined';
import Person from '@material-ui/icons/PersonOutline';
import BrandingWatermark from '@material-ui/icons/BrandingWatermarkOutlined';
import Reorder from '@material-ui/icons/Reorder';
import Work from '@material-ui/icons/Work';
import Mouse from '@material-ui/icons/Mouse'; // 마우스 아이콘
import HowToRegIcon from '@material-ui/icons/HowToReg';

// 크리에이터 라우터
import CreatorCampaignManage from './creator/CampaignManage';
import CreatorDashboard from './creator/Dashboard';
import CreatorManual from './creator/Manual';
import CreatorMyPage from './creator/Mypage';
import CreatorClickAdManage from './creator/ClickAdManage';
// import CreatorCPAManage from './creator/CPAManage';

// 마케터 라우터

import MarketerInventory from './marketer/Inventory';
import MarketerDashboard from './marketer/Dashboard';
import MarketerMyOffice from './marketer/MyOffice';
import MarketerCreateCampaign from './marketer/CampaignCreate';
import MarketerManual from './marketer/Manual';
import CpaStop from './temp/CPA-STOP';

export interface MypageRoute {
  path: string;
  name: string;
  icon: (props: SvgIconProps) => JSX.Element;
  component?: () => JSX.Element;
  layout: string;
  noTab?: boolean;
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
      path: '/banner',
      name: '내 배너광고',
      icon: BrandingWatermark,
      component: CreatorCampaignManage,
      layout: '/mypage/creator',
    },
    {
      path: '/ad-dashboard',
      name: '내 클릭광고',
      icon: Mouse,
      component: CreatorClickAdManage,
      layout: '/mypage/creator',
    },
    {
      path: '/cpa-dashboard',
      name: '참여형 광고',
      /**
       * CPA referer 안오는 문제로 점검
       * @since 2020. 11. 03
       * @by dan, martini
       */
      icon: HowToRegIcon,
      // component: CreatorCPAManage,
      component: CpaStop,
      layout: '/mypage/creator',
    },
    {
      path: '/manual',
      name: '사용 방법',
      icon: Reorder,
      component: CreatorManual,
      layout: '/mypage/creator',
    },
    {
      path: '/user',
      name: '내 계정',
      icon: Person,
      component: CreatorMyPage,
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
      name: '내 배너',
      icon: BrandingWatermark,
      component: () => <MarketerInventory />, // 마케터 대시보드 컴포넌트로 수정
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
      path: '/myoffice',
      name: '내 오피스',
      icon: Work,
      component: MarketerMyOffice,
      layout: '/mypage/marketer'
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
