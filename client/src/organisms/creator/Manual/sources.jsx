import HowToReg from '@material-ui/icons/HowToReg';
import BrandingWatermark from '@material-ui/icons/BrandingWatermark';
import Setting from '@material-ui/icons/Settings';
import AttachMoney from '@material-ui/icons/AttachMoney';
import InsertChart from '@material-ui/icons/InsertChart';
import ErrorIcon from '@material-ui/icons/Error';


const manualSources = {
  selectComponent: [
    {
      icon: HowToReg,
      label: 'OnAD 플랫폼과 계약',
    },
    {
      icon: BrandingWatermark,
      label: '광고 배너 송출',
    },
    {
      icon: Setting,
      label: '송출프로그램 개인 설정',
    },
    {
      icon: AttachMoney,
      label: '수익금 확인',
    },
    {
      icon: InsertChart,
      label: '출금 신청 및 수익데이터 확인',
    },
    {
      icon: ErrorIcon,
      label: '배너 오류 해결 방법',
    },
  ],
  contract: {
    subType: false,
    card: {
      title: 'OnAD 플랫폼과 계약하고 싶어요.',
      subtitle: 'OnAD 플랫폼과 계약할 수 있습니다. 서비스 이용약관과 개인정보 수집에 동의 해주세요.',
    },
    source: [
      {
        image: '/pngs/dashboard/manual/creator/1_1.png',
        description: '대쉬보드에서 계약하러 가기 알림창을 클릭합니다.',
      },
      {
        image: '/pngs/dashboard/manual/creator/1_2.png',
        description: '계정 관리에 있는 서비스 이용 및 출금 계약하기의\n서비스 이용약관과 개인 정보 수집 및 동의 약관보기를 클릭합니다.\n+ 내용을 읽고 모두 동의를 클릭합니다.',
      },
      {
        image: null,
        description: '모두 동의가 되면 체크박스가 2개 생깁니다.\n마지막으로 확인 버튼을 클릭해 주세요.',
      },
      {
        image: '/pngs/dashboard/manual/creator/1_3.png',
        description: '완료된 계약서는 계정관리 -> 크리에이터님의 정보란의\n계약완료를 눌러 확인 가능합니다.',
      },
      {
        image: null,
        description: 'OnAD 플랫폼과 크리에이터님의 이용계약이 완료되었습니다.\n매칭된 광고를 통해 수익을 창출해보세요. :)',
      },
    ],
  },
  setBanner: {
    subType: false,
    card: {
      title: '광고 배너를 송출하고 싶어요.',
      subtitle: '계약을 완료하면 크리에이터님 고유의 광고 URL을 부여합니다.',
    },
    source: [
      {
        image: '/pngs/dashboard/manual/creator/dashboard.png',
        description: '화면 왼쪽 네비게이션의 대시보드 탭을 클릭하세요.',
      },
      {
        image: '/pngs/dashboard/manual/creator/bannerError_5.png',
        description: '배너 오버레이 URL\n주소보기를 클릭해주세요.\n+10초동안 주소가 보여집니다.',
      },
      {
        image: null,
        description: '주소 오른쪽의 복사 버튼을 클릭해주세요.\n이제 크리에이터님의 방송 송출 프로그램을 활성화 해주세요.',
      },
    ],
  },

  programSetting: {
    subType: true,
    selectorImages: [
      {
        url: '/pngs/logo/xsplit_logo.jpg',
        title: 'XSplit Broadcaster',
      },
      {
        url: '/pngs/logo/obs_logo1.png',
        title: 'OBS Studio',
      },
    ],
    card: {
      title: '방송 개인 설정',
      subtitle: 'Xsplit, OBS 와 같은 방송송출 프로그램을 설정하세요.',
    },
    xsplit: {
      source: [
        {
          image: null,
          description: '권장사항 : Chrome(75 버전 이상)을 기본 브라우저으로 사용하셔야 광고가 송출 됩니다.',
        },
        {
          image: null,
          description: 'XSplit Broadcaster를 실행시킵니다.',
        },
        {
          image: '/pngs/dashboard/manual/creator/3_2.png',
          description: '하단에 있는 추가를 누른 후, \nWebpage 를 클릭합니다.\n(참고 : XSplit 2.9 이하의 버전에서는 기타(Others) - Webpage에 있습니다.\n되도록이면 XSplit 3.0 버전 이상으로 업그레이는 하는 것을 권장합니다.)',
        },
        {
          image: '/pngs/dashboard/manual/creator/3_3.png',
          description: '복사해둔 Url을 Ctrl + V 를 눌러 붙여넣고, OK를 클릭합니다.',
        },
        {
          image: '/pngs/dashboard/manual/creator/3_4.png',
          description: '(오른쪽 이미지를 클릭하여 참고해주세요.)\n1) 추가된 URL을 드래그 하여 맨 위에 둡니다.\n2) 추가된 URL에 커서를 올리면 방송 화면에 흰 테두리가 보입니다. 드래그하여 알맞은 위치가 크기로 조절하면 됩니다.',
        },
        {
          image: '/pngs/dashboard/manual/creator/3_5.png',
          description: `배너 소스를 우클릭합니다. 환경설정 창이 뜨면
          1. 스크롤바 숨기기에 체크
          2. 메모리 소스 유지를 체크
          해상도는 CUSTOM 선택 후 640 x 320으로 지정하세요.
          해상도를 설정 후 크기를 줄여도 비율은 유지됩니다.
          모든 설정이 끝나면 창 밖을 마우스로 클릭하여 환경설정 창을 닫습니다.`,
        },
        {
          image: null,
          description: '이제 매칭된 광고가 방송화면에 나타납니다.',
        },
      ],
    },
    obs: {
      source: [
        {
          image: null,
          description: '권장사항 : Chrome(75 버전 이상)을 기본 브라우저으로 사용하셔야 광고가 송출 됩니다.',
        },
        {
          image: null,
          description: 'OBS Studio를 실행시킵니다.',
        },
        {
          image: '/pngs/dashboard/manual/creator/3_7.png',
          description: '하단에 있는 소스 목록에서 + 를 누른 후, BrowserSource 를 클릭합니다.\n(참고 : OBS Studio 19 버전 이상 사용을 권장합니다.)',
        },
        {
          image: '/pngs/dashboard/manual/creator/3_8.png',
          description: '새로 만들기를 클릭하여 확인을 클릭합니다.\n(어떤 소스인지 구분하려면\nBrowserSource를 Alert Box와 같이 원하는 이름으로 변경 후\n확인 버튼을 클릭하면 됩니다.)',
        },
        {
          image: '/pngs/dashboard/manual/creator/3_9.png',
          description: '추가된 URL을 드래그 하여 맨 위에 둡니다.\n빨간 영역을 드래그 하여 위치와 크기를 조절합니다.',
        },
        {
          image: null,
          description: '이제 매칭된 광고가 방송화면에 나타납니다.',
        },
      ],
    },
  },
  income: {
    subType: false,
    card: {
      title: '쌓이는 수익금을 확인하기',
      subtitle: '광고를 송출하면 자동적으로 수익금이 쌓이고, 확인할 수 있습니다.',
    },
    source: [
      {
        image: '/pngs/dashboard/manual/creator/dashboard.png',
        description: '자신의 대시보드로 이동합니다.',
      },
      {
        image: '/pngs/dashboard/manual/creator/4_2.png',
        description: '광고가 매칭되면 자동적으로 배너이미지가 뜹니다.\n아쉽게도 아직 매칭되지 않았다면, 빈화면이 유지됩니다.',
      },
      {
        image: '/pngs/dashboard/manual/creator/4_3.png',
        description: '광고가 매칭된 상태에서 방송하게 되면 대시보드의 수익금에서\n10분마다 누적되는 수익금을 확인할 수 있습니다.',
      },
    ],
  },
  withdrawal: {
    card: {
      title: '계좌등록 및 출금하기',
      subtitle: '언제나 짜릿하고 늘 새로운 출금 시간입니다.',
    },
    source: [
      {
        image: '/pngs/dashboard/manual/creator/5_1.png',
        description: '왼쪽 네비게이션에서 수익관리 탭을 클릭합니다.',
      },
      {
        image: '/pngs/dashboard/manual/creator/5_2.png',
        description: '계좌 입력하기 알림창을 클릭하여 계좌정보를 입력합니다.',
      },
      {
        image: '/pngs/dashboard/manual/creator/5_3.png',
        description: '화면 오른쪽에 있는 출금신청을 누른 후,\n출금 가능 금액 이하의 금액을 입력합니다.\n이후 진행을 클릭합니다.\n(* 출금 신청 후 계좌로 입금되기 까지 1~2일 소요됩니다.)',
      },
      {
        image: '/pngs/dashboard/manual/creator/5_4.png',
        description: '출금신청 내역은 다음과 같이 확인 가능합니다.\n입금이 완료된 내역은 완료됨으로 표시됩니다.\n입금 진행 중인 내역은 <진행중> 으로 표시됩니다.',
      },
      {
        image: '/pngs/dashboard/manual/creator/5_5.png',
        description: '마지막으로 기간별 수익데이터를 확인 가능합니다.\n범위를 설정하여 기간별 데이터를 확인할 수 있습니다.',
      },
      {
        image: null,
        description: '이것으로 OnAD 플랫폼 이용안내를 마치겠습니다. 크리에이터님의 성장을 후원합니다.',
      },
    ],
  },
  bannerError: {
    card: {
      title: '배너 오류 해결 방법',
      subtitle: '배너송출 창의 오류 해결 방법입니다.',
    },
    source: [
      {
        image: null,
        description: '< IP 관련 오류 >',
      },
      {
        image: '/pngs/dashboard/manual/creator/bannerError_1.png',
        description: '오류창이 뜰 시, 계정관리로 이동합니다.',
      },
      {
        image: '/pngs/dashboard/manual/creator/bannerError_2.png',
        description: 'IP 변경하기를 클릭합니다.',
      },
      {
        image: '/pngs/dashboard/manual/creator/bannerError_3.png',
        description: '현재 PC의 IP를 바로 등록할 수 있습니다.',
      },
      {
        image: '/pngs/dashboard/manual/creator/bannerError_4.png',
        description: '직접 입력도 가능합니다. (방송 송출용 PC의 IP)',
      },
      {
        image: null,
        description: '< 오버레이 URL 관련 오류 >',
      },
      {
        image: '/pngs/dashboard/manual/creator/bannerError_5.png',
        description: '주소보기 클릭 후, 클립보드에 복사합니다.\n이후 과정은 2. 광고 배너 송출탭의 내용을 기반으로 진행하시면 됩니다.',
      },
    ],
  },
};


export default manualSources;
