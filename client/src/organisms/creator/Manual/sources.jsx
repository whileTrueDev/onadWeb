import HowToReg from '@material-ui/icons/HowToReg';
import BrandingWatermark from '@material-ui/icons/BrandingWatermark';
import AttachMoney from '@material-ui/icons/AttachMoney';
import InsertChart from '@material-ui/icons/InsertChart';
import Public from '@material-ui/icons/Public';
import Contactless from '@material-ui/icons/Contactless';

const HOST_URL = `${window.location.protocol}//${window.location.host}/dashboard/creator`;

function colorize(string, color) {
  return `<span style="color:${color}">${string}</span>`;
}

const manualSources = {
  selectComponent: [
    {
      icon: HowToReg,
      label: 'OnAD 플랫폼과 계약',
    },
    {
      icon: BrandingWatermark,
      label: '배너광고 송출 설정',
    },
    {
      icon: InsertChart,
      label: '수익 방식 및 수익 확인',
    },
    {
      icon: Public,
      label: '광고페이지 설정',
    },
    {
      icon: Contactless,
      label: '배너 송출 내역 확인'
    },
    {
      icon: AttachMoney,
      label: '수익금 출금',
    },
    // {
    //   icon: ErrorIcon,
    //   label: '배너 오류 해결 방법',
    // },
  ],

  contract: {
    subType: false,
    card: {
      title: 'OnAD 플랫폼과 계약하고 싶어요.',
      subtitle: '계약이후 배너송출 및 출금 등 올바른 서비스 이용이 가능합니다.',
    },
    source: [
      {
        image: '/pngs/dashboard/manual/new_creator/creator-contraction-01.png',
        description: `[**<대시보드>**](${HOST_URL}/main)의 상단에 있는 **서비스 이용 및 출금 계약하기**의  
        서비스 이용약관과 개인 정보 수집 및 동의 약관보기를 클릭합니다.  
        내용을 읽고 모두 동의를 클릭합니다.  `,
      },
      {
        image: null,
        description: '동의 이후, 체크박스가 생성된 것을 확인하세요.\n진행을 위해 확인 버튼을 클릭해 주세요.',
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-contraction-02.png',
        description: '계약 상태 및 계약서 확인은 **내 계정** 크리에이터님의 정보란에서 확인 가능합니다.',
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
      title: '배너 설정 및 광고 송출 방법',
      subtitle: '',
    },
    xsplit: {
      source: [
        {
          image: null,
          description: `권장사항 : **Chrome(75 버전 이상)**을 ${colorize('기본 브라우저으로 사용하셔야 광고가 올바르게 송출 됩니다.', 'red')}  
          크롬 버전 확인은 크롬 오른쪽 상단에 있는 아이콘 클릭 < 도움말 > - < Chrome 정보 >를 눌러 확인 가능합니다.`,
        },
        {
          image: '/pngs/dashboard/manual/new_creator/creator-setBanner-01.png',
          description: `배너를 송출하기 위해 [**<대시보드>**](${HOST_URL}/main)에서 **<배너 오버레이 주소>**를 확인하고, 복사하세요.`,
        },
        {
          image: '/pngs/dashboard/manual/creator/3_2.png',
          description: `XSplit Broadcaster를 실행시키 이후,  
          하단에 있는 추가를 누른 후, **< Webpage >** 를 클릭합니다.  
          (참고 : XSplit 2.9 이하의 버전에서는 기타(Others) - Webpage에 있습니다. XSplit 3.0 버전 이상을 사용하는 것을 권장합니다.)`,
        },
        {
          image: '/pngs/dashboard/manual/creator/3_3.png',
          description: '복사해둔 오버레이 주소를 Ctrl + V 를 눌러 붙여넣고, OK를 클릭합니다.',
        },
        {
          image: '/pngs/dashboard/manual/creator/3_4.png',
          description: `(오른쪽 이미지를 클릭하여 참고해주세요.)  
          추가된 URL을 드래그 하여 맨 위에 둡니다.  
          이후, 추가된 URL에 커서를 올리면 방송 화면에 흰 테두리가 보입니다.  
          테두리를 드래그하여 알맞은 위치로 조절하세요.`,
        },
        {
          image: '/pngs/dashboard/manual/creator/3_5.png',
          description: `배너 소스를 우클릭합니다. 환경설정 창이 뜨면  
          1. ${colorize('스크롤바 숨기기에 체크', 'red')}에 체크합니다.  
          2. ${colorize('메모리 소스 유지', 'red')}에 체크합니다.  
          해상도는 custom 선택 이후 **< 320 x 160 >** 으로 지정하세요.  
          해상도를 설정 후 크기를 줄여도 비율은 유지됩니다.  
          모든 설정이 끝나면 창 밖을 마우스로 클릭하여 환경설정 창을 닫습니다.`,
        },
        {
          image: null,
          description: `${colorize('배너 크기를 변경하고자 하는 경우', 'red')}에는  
          해당 배너 소스를 ${colorize('삭제', 'red')}한 이후 다시 생성하여  
          배너 해상도는 **< 320 x 160 >** 이상으로 지정하여야 합니다.  `,
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
          description: `권장사항 : **Chrome(75 버전 이상)**을 ${colorize('기본 브라우저으로 사용하셔야 광고가 올바르게 송출 됩니다.', 'red')}  
          크롬 버전 확인은 크롬 오른쪽 상단에 있는 아이콘 클릭 < 도움말 > - < Chrome 정보 >를 눌러 확인 가능합니다.`,
        },
        {
          image: '/pngs/dashboard/manual/new_creator/creator-setBanner-01.png',
          description: `배너를 송출하기 위해 [**<대시보드>**](${HOST_URL}/main)에서 <배너 오버레이 주소>를 확인하고, 복사하세요.`,
        },
        {
          image: '/pngs/dashboard/manual/creator/3_7.png',
          description: `OBS Studio를 실행시킨 이후,  
          하단에 있는 **소스 목록**에서 **+ 버튼** 을 누른 후,  **BrowserSource** 를 클릭합니다.  
          (참고 : OBS Studio 19 버전 이상 사용을 권장합니다.)`,
        },
        {
          image: '/pngs/dashboard/manual/creator/3_8.png',
          description: `새로 만들기를 클릭하여 확인을 클릭합니다.  
          (어떤 소스인지 구분하려면 **BrowserSource**를 **"온애드광고박스"**와 같이 원하는 이름으로 변경 후 확인 버튼을 클릭하면 됩니다.)`,
        },
        {
          image: '/pngs/dashboard/manual/creator/3_9.png',
          description: `추가된 소스를 드래그하여 **맨 위에 둡니다.**  
          빨간 영역을 드래그 하여 위치를 조절합니다.  
          크기는 **< 320 x 160 >** 으로 설정합니다.`,
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
      title: '수익금 확인 및 수익방식',
      subtitle: '광고를 송출하면 자동적으로 수익금이 쌓입니다.',
    },
    source: [
      {
        image: '/pngs/dashboard/manual/new_creator/creator-income-00.png',
        description: `배너광고는 광고송출 알고리즘에 따라 **자동적으로 송출됩니다.**  
        상황에 따라, 곧바로 광고가 송출되지 않을 수 있습니다.`,
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-income-01.png',
        description: `방송 중, 광고가 송출되면 **수익금이 자동적으로 누적됩니다.**  
        수익금은 송출시간 및 시청인원, 광고레벨 등 여러 변수에 의해 결정됩니다.  
        누적되는 수익금은 대시보드에서 확인할 수 있습니다.`,
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-income-02.png',
        description: `송출된 광고는 크리에이터님의 **광고페이지**에도 게시됩니다.  
        게시된 광고페이지의 **상호작용(광고 조회, 상품 및 브랜드 페이지 이동 등)에 따라 수익은 추가적으로 발생합니다.**  
        또한, 광고페이지 상호작용에 따라 크리에이터님의 **광고 레벨**도 상승합니다.  
        광고 단가 책정, 이벤트 및 광고 선정 우선순위에 가산점으로 작용할 수 있습니다.`
      },
    ],
  },
  landing: {
    subType: false,
    card: {
      title: '내 광고페이지를 관리하기',
      subtitle: '광고 페이지를 관리하고, 패널에 배너를 업로드하고, 현황을 확인하세요'
    },
    source: [
      {
        image: null,
        description: `자신의 방송 채널에 **광고페이지 바로가기 배너**를 게시해 더욱 많은 광고 수익을 얻어보세요.  
        시청자들의 상호작용에 의해 추가적 광고 수익이 발생할 수 있습니다.  
        `
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-landing-00.png',
        description: `자신의 트위치 방송채널에서, 패널 편집을 ON 으로 바꾼 후,  
        **텍스트나 이미지 패널 추가**를 클릭하세요.`
      },
      {
        image: '',
        description: `자신만의 광고페이지 이동 배너를 업로드하거나,  
        [**<내 광고페이지>**](${HOST_URL}/landing)에서 기본이미지를 다운로드 받아 업로드하세요.  
        이와 함께, ${colorize('**이미지 링크에는 자신의 광고페이지 주소를 입력**', 'red')}하세요`
      },
      {
        image: null,
        description: `[**<내 광고페이지>**](${HOST_URL}/landing) 에서 광고페이지의 **소개글**과  
        **라이트 / 다크모드**, **배경이미지** 등을설정하세요. 커스텀 기능은 점차적으로 업데이트 됩니다.  
        `
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-landing-01.png',
        description: `대시보드 또는 내 광고페이지에서 현황을 확인할 수 있습니다.  
        `
      },
    ]
  },
  bannerlist: {
    subType: false,
    card: { title: '진행한 모든 배너를 확인' },
    source: [
      {
        image: '/pngs/dashboard/manual/new_creator/creator-banner-01.png',
        description: `[**<너관리>**](${HOST_URL}/banner)에서 지금까지 진행한 모든 배너와,  
        해당 배너 및 광고주의 정보, 해당 배너로 인한 수익정보를 확인할 수 있습니다.`
      },
    ]
  },
  withdrawal: {
    card: { title: '수익금 출금' },
    source: [
      {
        image: '/pngs/dashboard/manual/new_creator/creator-withdrawal-01.png',
        description: `[**<내 계정>**](${HOST_URL}/user)으로 이동하여 출금계좌를 등록하세요.`,
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-withdrawal-03.png',
        description: `[**<대시보드>**](${HOST_URL}/main)에서 <출금신청> 버튼을 클릭하여  
        **출금 가능 금액 이하의 금액**을 입력하여 신청할 수 있습니다.  
        **최소 출금 가능 금액**은 3만원입니다.  
        출금 신청된 금액은 신청한 달의 다음달 10일에 등록한 계좌로 정산됩니다.`,
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-withdrawal-02.png',
        description: `출금신청 내역은 다음과 같이 확인 가능합니다.  
        입금이 완료된 내역은 **<완료됨>** 으로 표시됩니다.  
        입금 진행 중인 내역은 **<정산대기>** 로 표시됩니다.`,
      },
    ],
  },
};

export default manualSources;
// bannerError: {
//   card: {
//     title: '배너 오류 해결 방법',
//     subtitle: '배너송출 창의 오류 해결 방법입니다.',
//   },
//   source: [
//     {
//       image: null,
//       description: '< IP 관련 오류 >',
//     },
//     {
//       image: '/pngs/dashboard/manual/creator/bannerError_1.png',
//       description: '오류창이 뜰 시, 계정관리로 이동합니다.',
//     },
//     {
//       image: '/pngs/dashboard/manual/creator/bannerError_2.png',
//       description: 'IP 변경하기를 클릭합니다.',
//     },
//     {
//       image: '/pngs/dashboard/manual/creator/bannerError_3.png',
//       description: '현재 PC의 IP를 바로 등록할 수 있습니다.',
//     },
//     {
//       image: '/pngs/dashboard/manual/creator/bannerError_4.png',
//       description: '직접 입력도 가능합니다. (방송 송출용 PC의 IP)',
//     },
//     {
//       image: null,
//       description: '< 오버레이 URL 관련 오류 >',
//     },
//     {
//       image: '/pngs/dashboard/manual/creator/bannerError_5.png',
//       description: '주소보기 클릭 후, 클립보드에 복사합니다.\n이후 과정은 2. 광고 배너 송출탭의 내용을 기반으로 진행하시면 됩니다.',
//     }, ],
// },
