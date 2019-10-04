import CloudUpload from '@material-ui/icons/CloudUpload';
import BrandingWatermark from '@material-ui/icons/BrandingWatermarkOutlined';
import InsertChart from '@material-ui/icons/InsertChart';

const manualSources = {
  selectComponent: [
    {
      icon: CloudUpload,
      label: '광고 등록',
    },
    {
      icon: BrandingWatermark,
      label: '승인된 배너 송출',
    },
    {
      icon: InsertChart,
      label: '광고 성과차트',
    },
  ],
  bannerRegist: {
    card: {
      title: '광고배너 등록',
      subtitle: '크리에이터의 방송에 송출하고자 하는 광고를 등록하고 관리할 수 있습니다.',
    },
    source: [
      {
        image: null,
        description: '대쉬보드에서 계약하러 가기 알림창을 클릭합니다.',
      },
      {
        image: '/pngs/dashboard/manual/marketer/1_1.PNG',
        description: '먼저 자신의 배너 관리 탭으로 이동합니다.',
      },
      {
        image: '/pngs/dashboard/manual/marketer/1_2.PNG',
        description: '화면 오른쪽에 있는 배너 등록하기에서 등록을 클릭해주세요.\n파일찾기 후 업로드를 클릭해주세요.',
      },
      {
        image: '/pngs/dashboard/manual/marketer/1_3.PNG',
        description: '등록한 배너는 OnAD 플랫폼의 관리자 승인을 받아야 합니다.\n심의 진행중인 배너는 X 심의취소와 삭제가 가능합니다.',
      },
      {
        image: '/pngs/dashboard/manual/marketer/1_4.PNG',
        description: '관리자 승인이 거절된 배너는 X 배너삭제를 클릭하면 삭제 가능합니다.',
      },
      {
        image: '/pngs/dashboard/manual/marketer/1_5.PNG',
        description: '관리자 승인이 완료된 배너는 광고시작을 클릭하면 광고 송출이 가능합니다.\n마케터님의 금액 입금이 확인되면 대시보드에서 승인된 배너를 확인할 수 있습니다.',
      },
      {
        image: null,
        description: '이제 광고 송출이 가능합니다.',
      },

    ],
  },
  bannerStart: {
    card: {
      title: '배너 광고 송출',
      subtitle: '승인된 배너광고들을 대시보드에서 송출 및 제어가 가능합니다.',
    },
    source: [
      {
        image: null,
        description: '마케터님의 대시보드로 이동합니다.',
      },
      {
        image: '/pngs/dashboard/manual/marketer/2_1.PNG',
        description: '승인된 배너 이미지를 클릭하여 해당 광고시작을 클릭합니다.\n승인된 배너 이미지 클릭을 통해 개별 배너 광고의 송출과 중단이 가능합니다.',
      },
      {
        image: '/pngs/dashboard/manual/marketer/2_2.PNG',
        description: '현재 나의 상태에서 승인된 배너들을 일괄 제어할 수 있습니다.\nON 으로 모든 광고를 개별 제어합니다.\nOFF 로 모든 광고송출 중단합니다.',
      },
      {
        image: '/pngs/dashboard/manual/marketer/2_3.PNG',
        description: '화면 하단에서 매칭된 크리에이터들을 조회 가능하며\n각 크리에이터명을 클릭하면 정보조회가 가능합니다.',
      },
      {
        image: null,
        description: '매칭된 크리에이터들이 방송 내에서 배너를 띄우면 마케터님의 광고가 송출되며\n광고캐시가 차감됩니다.',
      },
    ],
  },
  seeChart: {
    card: {
      title: '광고 성과차트',
      subtitle: '광고집행에 대한 성과차트를 볼 수 있습니다.',
    },
    source: [
      {
        image: '/pngs/dashboard/manual/marketer/3_1.PNG',
        description: '매칭된 크리에어터들이 배너광고를 송출하면 10분마다 캐시가 차감됩니다.',
      },
      {
        image: null,
        description: '광고캐시가 소진될 때까지 크리에이터들은 마케터님의 광고를 송출합니다.\n추후에 캐시충전과 캐시 환불 기능 도입예정입니다.',
      },
      {
        image: '/pngs/dashboard/manual/marketer/3_3.PNG',
        description: '화면 하단에서 매칭된 크리에이터들의 방송을 통해\n마케터님의 광고의 성과차트를 확인할 수 있습니다.',
      },
      {
        image: null,
        description: '마케터님의 광고를 OnAd를 통해 1인 미디어로 송출하세요!',
      },

    ],
  },
};

export default manualSources;
