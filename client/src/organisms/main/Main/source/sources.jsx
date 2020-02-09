import BrandingWatermark from '@material-ui/icons/BrandingWatermark';
import BrandingWatermarkOutlined from '@material-ui/icons/BrandingWatermarkOutlined';
import Subscriptions from '@material-ui/icons/Subscriptions';
import ShowChart from '@material-ui/icons/ShowChart';
import Router from '@material-ui/icons/Router';
import BarChart from '@material-ui/icons/BarChart';

const sources = {
  hero: {
    text: {
      title: '실시간 광고매칭',
      subTitle: '플랫폼 온애드',
      marketerTail: '1인 미디어 컨텐츠 속 광고,\n복잡한 절차없이 배너만 등록하세요\n함께 하고있는 크리에이터들의 방송에\n즉시 송출 할 수 있습니다.',
      creatorTail: '간단한 설정만으로\n배너를 송출하고, 방송한 만큼\n 추가수익을 가져가세요'
    },
  },
  howTo: {
    title: '쉽고 간단한',
    subTitle: '이용방법',
    text: '광고할 배너 이미지 파일을 업로드하여 관리자승인을 요청하세요.\n승인된 배너이미지는 광고캠페인에 등록하여 크리에이터 방송에 송출할 수 있어요.\n간단하게 1인 미디어 방송에 광고를 내보내세요.'
  },
  advantage: {
    first: '기존의 1인 미디어에 광고하기 위해 광고주 분들이\n개개인의 크리에이터와 했던 길고 복잡한 계약을 미리 완료하였습니다.\n온애드는 가장 간편하게 광고할 수 있는 방법입니다.',
    second: '나의 광고가 어떤 방송에서 송출되고 있는지,\n얼마의 비용이 발생된 상태인지, 노출량은 어느정도인지 등\n다양한 수치적 정보들을 실시간으로 확인할 수 있는\n광고효과 보고서를 제공합니다. ',
    third: '온애드에서는 정확히 노출된 만큼만 요금이 부과되며\n충전한 예치금(예산)에 맞게 광고가 진행되는\n시스템이므로 합리적입니다!'
  },
  howitworks: {
    content: {
      title: '바로 지금 온애드와 함께하세요',
      text: '대한민국 1등, 1인 미디어 배너 광고 플랫폼의 대표 주자 온애드!\n성공적인 광고 송출을 위해 항상 노력하겠습니다.\n궁금하신 것 무엇이든 문의남겨주세요.',
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
