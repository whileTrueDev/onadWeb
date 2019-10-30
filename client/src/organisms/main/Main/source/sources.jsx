import BrandingWatermark from '@material-ui/icons/BrandingWatermark';
import BrandingWatermarkOutlined from '@material-ui/icons/BrandingWatermarkOutlined';
import Subscriptions from '@material-ui/icons/Subscriptions';
import ShowChart from '@material-ui/icons/ShowChart';
import Router from '@material-ui/icons/Router';
import BarChart from '@material-ui/icons/BarChart';

const sources = {
  hero: {
    text: {
      title: '1인 미디어 실시간 방송에',
      subTitle: '배너광고 넣으실래요?',
      marketer: '마케터 고객님',
      marketerTail: '광고를 한 시간만큼\n광고 하고 싶은 금액만큼만\n원하는대로, 하고 싶은대로',
      creator: '크리에이터 고객님',
      creatorTail: '간단한 설정만으로\n배너를 송출하고, 방송한 만큼\n 추가수익을 가져가세요'
    },
  },
  categories: [
    {
      url: '/pngs/main/mainBenefit1.png',
      title: '누구나 1인 미디어 마케팅',
      fullDescription: '1인 미디어에 광고를 올리고 싶지만 크리에이터에 \n 대해 모르거나, 일일이 계약하기 힘든 광고주.\n광고주를 찾기 힘든 크리에이터 모두에게 \n 광고를 유치하고 집행할 수 있는 기회를 제공합니다.',
      trigger: {
        threshold: 0,
        timeout: 500,
      }
    },
    {
      url: '/pngs/main/mainBenefit2.png',
      title: '비용, 수익에 대한 실시간 분석',
      fullDescription: '광고 집행으로 발생하는 비용과 수익을 실시간으로\n 볼 수 있으며, 어떻게 그 금액이 발생하였는지에 대한\n광고 시간, 노출량 등을 분석하여 확인할 수 있습니다.',
      trigger: {
        threshold: 0,
        timeout: 1000,
      }
    },
    {
      url: '/pngs/main/mainBenefit3.png',
      title: '자유로운 금액설정',
      fullDescription: '광고주는 목표 노출량과 광고예산을 정할 수 있고, \n크리에이터는 정산 기간에 광고수익 한도 내에서\n원하는 금액을 정산 받을 수 있습니다.',
      trigger: {
        threshold: 200,
        timeout: 500,
      }
    },
    {
      url: '/pngs/main/mainBenefit4.png',
      title: '합리적 가격 책정',
      fullDescription: '광고를 송출한 시간과 노출량만큼 금액을 책정하기\n때문에 \'부르는게 값\'이 아닌 합리적인 이익 배분을\n가능하게 합니다.',
      trigger: {
        threshold: 200,
        timeout: 1000,
      }
    },
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
};

export default sources;
