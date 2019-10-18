import HowToReg from '@material-ui/icons/HowToReg';
import BrandingWatermark from '@material-ui/icons/BrandingWatermark';
import Setting from '@material-ui/icons/Settings';
import AttachMoney from '@material-ui/icons/AttachMoney';
import InsertChart from '@material-ui/icons/InsertChart';
import ErrorIcon from '@material-ui/icons/Error';
import { minHeight } from '@material-ui/system';


const manualSources = {
  selectComponent: [
    {
      icon: HowToReg,
      label: 'OnAD 플랫폼과 계약',
    },
    {
      icon: BrandingWatermark,
      label: '배너광고 송출',
    },
    {
      icon: AttachMoney,
      label: '수익 방식 및 수익 확인',
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
      subtitle: '계약이후 배너송출 및 출금 등 올바른 서비스 이용이 가능합니다.',
    },
    source: [
      {
        image: '/pngs/dashboard/manual/new_creator/creator-contraction-01.png',
        description: `대시보드의 상단에 있는 **서비스 이용 및 출금 계약하기**의  
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
          description: `권장사항 : **Chrome(75 버전 이상)**을 <span style="color:red">기본 브라우저으로 사용하셔야 광고가 올바르게 송출 됩니다.</span>  
          크롬 버전 확인은 크롬 오른쪽 상단에 있는 아이콘 클릭 < 도움말 > - < Chrome 정보 >를 눌러 확인 가능합니다.`,
        },
        {
          image: '/pngs/dashboard/manual/new_creator/creator-setBanner-01.png',
          description: '배너를 송출하기 위해 **<배너 오버레이 주소>**를 확인하고, 복사하세요.',
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
          1. <span style="color: red">스크롤바 숨기기에 체크</span>에 체크합니다.  
          2. <span style="color: red">메모리 소스 유지</span>에 체크합니다.  
          해상도는 custom 선택 이후 **< 320 x 160 >** 으로 지정하세요.  
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
          description: `권장사항 : **Chrome(75 버전 이상)**을 <span style="color:red">기본 브라우저으로 사용하셔야 광고가 올바르게 송출 됩니다.</span>  
          크롬 버전 확인은 크롬 오른쪽 상단에 있는 아이콘 클릭 < 도움말 > - < Chrome 정보 >를 눌러 확인 가능합니다.`,
        },
        {
          image: '/pngs/dashboard/manual/new_creator/creator-setBanner-01.png',
          description: '배너를 송출하기 위해 <배너 오버레이 주소>를 확인하고, 복사하세요.',
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
  landing: {
    subType: false,
    card: {
      title: '내 광고페이지를 관리하기',
      subtitle: '광고 페이지를 관리하고, 현황을 확인하세요'
    },
    source: [
      {}
    ]
  },
  income: {
    subType: false,
    card: {
      title: '쌓이는 수익금을 확인하기',
      subtitle: '광고를 송출하면 자동적으로 수익금이 쌓입니다.',
    },
    source: [
      {
        image: '/pngs/dashboard/manual/creator/4_2.png',
        description: `배너광고는 광고송출 알고리즘에 따라 **자동적으로 송출됩니다.**  
        상황에 따라, 곧바로 광고가 송출되지 않을 수 있습니다.`,
      },
      {
        image: '/pngs/dashboard/manual/creator/4_3.png',
        description: `방송 중, 광고가 송출되면 **수익금이 자동적으로 누적됩니다.**  
        수익금은 송출시간 및 시청인원, 광고레벨 등 여러 변수에 의해 결정됩니다.  
        누적되는 수익금은 대시보드에서 확인할 수 있습니다.`,
      },
      {
        image: null,
        description: `송출된 광고는 크리에이터님의 **광고페이지**에도 게시됩니다.  
        게시된 광고페이지의 **상호작용(광고 조회, 상품 및 브랜드 페이지 이동 등)에 따라 수익은 추가적으로 발생합니다.**`
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
