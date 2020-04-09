// 라우터 아이콘 @material-ui/icons
import React from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import Dashboard from '@material-ui/icons/DashboardOutlined';
import Person from '@material-ui/icons/PersonOutline';
import BrandingWatermark from '@material-ui/icons/BrandingWatermarkOutlined';
import Reorder from '@material-ui/icons/Reorder';
import Work from '@material-ui/icons/Work';
import Mouse from '@material-ui/icons/Mouse'; // 마우스 아이콘
import Public from '@material-ui/icons/Public'; // 지구본 아이콘

// 크리에이터 라우터
import CreatorCampaignManage from './creator/CampaignManage';
import CreatorDashboard from './creator/Dashboard';
import CreatorManual from './creator/Manual';
import CreatorMyPage from './creator/Mypage';
import CreatorAdDashboard from './creator/ClickAdManage';
import AdPageManage from './creator/AdPageManage';

// 마케터 라우터

import MarketerInventory from './marketer/Inventory';
import MarketerDashboard from './marketer/Dashboard';
import MarketerMyOffice from './marketer/MyOffice';
import CampaignCreateStepper from './marketer/CampaignCreation';
import MarketerManual from './marketer/Manual';

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
      path: '/ad-page',
      name: '내 광고페이지 (변경 예정)',
      icon: Public,
      component: AdPageManage,
      layout: '/mypage/creator',
    },
    {
      path: '/ad-dashboard',
      name: '내 클릭광고',
      icon: Mouse,
      component: CreatorAdDashboard,
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
      // component: () => <div />,
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
      component: CampaignCreateStepper,
      layout: '/mypage/marketer',
      noTab: true
    },
  ],
};

export default dashboardRoutes;
