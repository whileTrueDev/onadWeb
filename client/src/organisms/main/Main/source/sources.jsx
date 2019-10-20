import BrandingWatermark from '@material-ui/icons/BrandingWatermark';
import BrandingWatermarkOutlined from '@material-ui/icons/BrandingWatermarkOutlined';
import Subscriptions from '@material-ui/icons/Subscriptions';
import ShowChart from '@material-ui/icons/ShowChart';
import Router from '@material-ui/icons/Router';
import BarChart from '@material-ui/icons/BarChart';

const sources = {
  hero: {
    // backImage: '/pngs/main/main_image.jpg',
    text: {
      title: '실시간 스트리밍 방송에',
      // body: '온애드는 크리에이터와 광고주를 연결해주는 실시간 광고 송출 플랫폼입니다.',
      subTitle: '배너광고 넣으실래요?',
      marketer: '마케터 고객님',
      marketerTail: '광고를 한 시간만큼\n광고 하고 싶은 금액만큼만\n원하는대로, 하고 싶은대로',
      creator: '크리에이터 고객님',
      creatorTail: '원하는 시간만큼, 껏다 켰다\n자유로운 광고, 시청자수와\n방송시간에 비례한 수익'
    },
  },
  categories: [
    {
      url: '/pngs/main/mainBenefit1.png',
      // isText: true,
      title: '누구나 1인 미디어 마케팅',
      fullDescription: '1인 미디어에 광고를 올리고 싶지만 크리에이터에 \n 대해 모르거나, 일일이 계약하기 힘든 광고주.\n광고주를 찾기 힘든 크리에이터 모두에게 \n 광고를 유치하고 집행할 수 있는 기회를 제공합니다.',
      width: '50%',
    },
    {
      url: '/pngs/main/mainBenefit2.png',
      // isText: false,
      title: '비용, 수익에 대한 실시간 분석',
      fullDescription: '광고 집행으로 발생하는 비용과 수익을 실시간으로\n 볼 수 있으며, 어떻게 그 금액이 발생하였는지에 대한\n광고 시간, 노출량 등을 분석하여 확인할 수 있습니다.',
      width: '50%',
    },
    {
      url: '/pngs/main/mainBenefit3.png',
      // isText: false,
      title: '자유로운 금액설정',
      fullDescription: '광고주는 목표 노출량과 광고예산을 정할 수 있고, \n크리에이터는 정산 기간에 광고수익 한도 내에서\n원하는 금액을 정산 받을 수 있습니다.',
      width: '50%',
    },
    {
      url: '/pngs/main/mainBenefit4.png',
      // isText: false,
      title: '합리적 가격 책정',
      fullDescription: '광고를 송출한 시간과 노출량만큼 금액을 책정하기\n때문에 \'부르는게 값\'이 아닌 합리적인 이익 배분을\n가능하게 합니다.',
      width: '50%',
    },
    // {
    //   url: '/pngs/main/open_beta.jpg',
    //   isText: true,
    //   title: '오픈베타가',
    //   subTitle: '예정되어있습니다',
    //   description: '2019.10.',
    //   fullDescription: 'OnAD는 2019년 10월 중 오픈베타 예정입니다.\nOnAD 팀원들은 "성장"의 가치를 추구합니다. 지속적으로 기술 발전을 추구하고, 끊임없이 사고합니다. OnAD와 함께 성장하시겠습니까?',
    //   width: '100%',
    //   opacity: 0.3,
    //   height: 300,
    // },
  ],

  howitworks: {
    content: {
      title: '지금 당장 시작하기',
      text: '도움이 필요하신 경우 바로 카카오 플러스 친구추가 및\n전화로 연결해주십시오. 소중한 고객 놓지 않겠습니다.\n고객센터와 전화로 연결해주세요',
      location: 'mainpageLogin'
    },
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
  marketerWorks: {
    content: {
      title: '지금 바로 시작하세요',
      text: '간단한 약관만 수락해주시면 바로 해보실 수 있습니다.\n배너를 등록하시면 실시간으로 광고를 본 시청자 수에 비례해 금액이 차감됩니다.\n궁금한 사항이 있으시면 고객센터와 플러스친구에 문의주십시오.'
    },
  },
  creatorWorks: {
    content: {
      title: '지금 바로 트위치 아이디로 시작하세요',
      text: '간단한 약관만 수락해주시면 바로 해보실 수 있습니다.\n간단하게 오버레이주소만 복사해서 방송송출프로그램에 붙여넣어 주시면 됩니다'
    },
  }
};

export default sources;
