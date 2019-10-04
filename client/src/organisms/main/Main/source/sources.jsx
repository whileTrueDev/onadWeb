import BrandingWatermark from '@material-ui/icons/BrandingWatermark';
import BrandingWatermarkOutlined from '@material-ui/icons/BrandingWatermarkOutlined';
import Subscriptions from '@material-ui/icons/Subscriptions';
import ShowChart from '@material-ui/icons/ShowChart';
import Router from '@material-ui/icons/Router';
import BarChart from '@material-ui/icons/BarChart';

const sources = {
  hero: {
    backImage: '/pngs/main/main_image.jpg',
    text: {
      title: '배너광고의 새로운 기준',
      subTitle: 'ONAD',
      body: '온애드는 크리에이터와 광고주를 연결해주는 실시간 광고 송출 플랫폼입니다.',
      // tail: '베너광고에 필요한 모든 과정을 온애드에서 손쉽게 진행하실 수 있습니다.',
    },
  },
  categories: [
    {
      url: '/pngs/main/category_1.jpg',
      isText: false,
      title: '1인 방송 마케팅',
      fullDescription: '1인 미디어에 광고를 올리고 싶지만 크리에이터에 대해 모르거나, 일일이 계약하기 힘든 광고주.\n광고주를 찾기 힘든 크리에이터 모두에게 광고를 유치하고 집행할 수 있는 기회를 제공합니다.',
      width: '50%',
    },
    {
      url: '/pngs/main/category_2.jpg',
      isText: false,
      title: '합리적 금액 책정',
      fullDescription: 'OnAD는 시청자 수 및 조회수에 기반힌 광고 집행량에 따라 금액을 산정합니다.\n합리적인 방식의 과금체계를 통해 광고 집행으로 발생하는 비용과 수익을 투명하게 확인할 수 있습니다.',
      width: '50%',
    },
    {
      url:
      '/pngs/main/category_3.jpg',
      isText: false,
      title: '관련성 기반 매칭 시스템',
      fullDescription: '배너의 카테고리 및 특징과 크리에이터의 방송 컨텐츠의 연관성을 분석하여 실시간으로 가장 관련있는 방송에 광고가 들어갈 수 있습니다.\n분석은 영상 이미지, 크리에이터의 음성, 시청자 반응등을 토대로 진행됩니다. 예를 들면, 치킨먹방 방송 시, 맥주 배너가 나타나는 것처럼 말이죠.',
      width: '50%',
    },
    {
      url: '/pngs/main/category_4.jpg',
      isText: false,
      title: '실시간 비용 분석',
      fullDescription: '광고 집행으로 발생하는 비용과 수익을 실시간으로 볼 수 있으며 광고 시간, 노출량 등을 분석을 통해 확인할 수 있습니다.',
      width: '50%',
    },
    {
      url: '/pngs/main/open_beta.jpg',
      isText: true,
      title: '오픈베타가',
      subTitle: '예정되어있습니다',
      description: '2019.10.',
      fullDescription: 'OnAD는 2019년 10월 중 오픈베타 예정입니다.\nOnAD 팀원들은 "성장"의 가치를 추구합니다. 지속적으로 기술 발전을 추구하고, 끊임없이 사고합니다. OnAD와 함께 성장하시겠습니까?',
      width: '100%',
      opacity: 0.3,
      // height: 300,
    },
  ],

  howitworks: {
    creator: {
      title: '간단한 설정 한번으로 광고를 유치하세요',
      buttonText: '크리에이터로 시작하기',
      items: [
        {
          title: 'OBS, Xsplit 등의 방송송출 프로그램에 오버레이 주소를 추가시키기만 하세요.',
          icon: BrandingWatermark,
        },
        {
          title: '한번 설정하기만 하면, 방송과 관련 있는 광고가 자동으로 송출됩니다.',
          icon: Subscriptions,
        },
        {
          title: '어떤 광고가 진행되어 왔는지, 나의 총 광고수익은 얼마인지. 대시보드에서 쉽게 확인하고 수익금을 출금하세요.',
          icon: ShowChart,
        },
      ],
    },
    marketer: {
      title: '불편한 계약없이 광고를 집행하세요',
      buttonText: '마케터로 시작하기',
      items: [
        {
          title: '배너를 등록하고 관련성 매칭을 통해 추천된 크리에이터 목록을 확인하세요.',
          icon: BrandingWatermarkOutlined,
        },
        {
          title: '클릭 한번으로 간단하게 광고를 집행하세요.',
          icon: Router,
        },
        {
          title: '광고가 어떻게 진행되고 있는지, 실시간으로 집행된 금액은 얼마인지, 광고의 효과는 어떻게 되는지 확인하세요.',
          icon: BarChart,
        },
      ],
    },
  },
};

export default sources;
