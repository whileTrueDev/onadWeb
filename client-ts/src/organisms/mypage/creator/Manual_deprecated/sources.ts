import HowToReg from '@material-ui/icons/HowToReg';
import BrandingWatermark from '@material-ui/icons/BrandingWatermark';
import AttachMoney from '@material-ui/icons/AttachMoney';
import InsertChart from '@material-ui/icons/InsertChart';
import Public from '@material-ui/icons/Public';
import Contactless from '@material-ui/icons/Contactless';

import { ManualSources } from '../../shared/ManualTypes';
import textStyling from '../../shared/textStyling';

const manualSources: ManualSources = {
  selectComponent: [
    {
      icon: HowToReg,
      label: '온애드 이용 동의',
    },
    {
      icon: BrandingWatermark,
      label: '배너광고 송출 설정',
    },
    {
      icon: InsertChart,
      label: '수익방식 및 수익확인',
    },
    {
      icon: Public,
      label: '클릭광고 설정',
    },
    {
      icon: Contactless,
      label: '배너 송출 내역 확인',
    },
    {
      icon: AttachMoney,
      label: '수익금 출금',
    }
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
        description: `${textStyling.LinkText('<대시보드>', 'main')}로 이동하여 상단에 있는 서비스 이용 및 출금 계약하기의 ${textStyling.styledText('약관보기')}를 클릭합니다.  
        내용을 읽고 모두 ${textStyling.styledText('동의')}를 클릭합니다.
        `,
      },
      {
        image: null,
        description: `동의 이후, 체크표시 <img src='/pngs/dashboard/manual/new_creator/creator-contraction-02.png' style="width: 120px; height: 40px; vertical-align: middle"/>가 생성된 것을 확인하세요.진행을 위해 ${textStyling.styledText('확인')} 버튼을 클릭해 주세요.`,
      },
      {
        image: null,
        description: `계약 상태 및 계약서 확인은 ${textStyling.LinkText('<내 계정>', 'user')} 크리에이터님의 정보란에서 확인 가능합니다.`,
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
    xsplit: [
      {
        image: null,
        description: `${textStyling.styledBlock(`권장사항: Chrome(75 버전 이상)을 기본 브라우저로 사용하셔야 광고가 올바르게 송출됩니다.</br>
          크롬 버전 확인은 크롬 오른쪽 상단에 있는 아이콘 클릭 ${textStyling.styledText('도움말')} > ${textStyling.styledText('Chrome 정보')}를 눌러 확인 가능합니다.`)}`,
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-setBanner-01.png',
        description: `배너를 송출하기 위해 ${textStyling.LinkText('<대시보드>', 'main')}에서 배너 오버레이 URL의 ${textStyling.styledText('주소보기')}를 누르고 ${textStyling.styledText('복사')}를 눌려주세요.`,
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-setBanner-02.png',
        description: `XSplit Broadcaster를 실행시키 뒤,  
          하단에 있는 ${textStyling.styledText('추가')}를 누른 후, ${textStyling.styledText('Webpage')}를 클릭합니다. ${textStyling.styledBlock('(참고 : XSplit 2.9 이하의 버전에서는 기타(Others) - Webpage에 있습니다.</br>XSplit 3.0 버전 이상을 사용하는 것을 권장합니다.)')}`,
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-setBanner-03.png',
        description: `복사해둔 오버레이 주소를 ${textStyling.styledText('Ctrl + V')}를 눌러 붙여넣고, ${textStyling.styledText('OK')}를 클릭합니다.`,
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-setBanner-04.png',
        description: `추가된 추가된 ${textStyling.styledText('URL')}을 드래그하여 맨 위에 둡니다.
          `,
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-setBanner-05.png',
        description: `배너 소스를 우클릭합니다. 환경설정 창이 뜨면 ${textStyling.styledText('HTML')}을 클릭하고  
          1. 스크롤바 숨기기에 체크에 합니다.  
          2. 메모리 소스유지에 체크합니다.  
          3. 해상도를 ${textStyling.styledText('custom')} 선택 이후 < 320 X 160 >으로 지정하세요. 해상도를 설정 후 크기를 줄여도 비율은 유지됩니다.`,
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-setBanner-06.png',
        description: `환경설정 창의 레이아웃을 클릭하고  
          내 방송의 해상도가 (1080p)이상이면 배너 크기를 width: 320, height: 160  
          내 방송의 해상오가 (720p)이면 배너크기를 width: 214, height: 107로 설정해 줍니다.`,
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-setBanner-07.png',
        description: `${textStyling.styledBlock('내 방송의 해상도 확인은 오른쪽 위를 클릭하여 확인할 수 있습니다.')}`,
      },
      {
        image: null,
        description: `배너 크기를 변경하고자 하는 경우에는  
          해당 배너소스를 삭제한 이후 다시 생성하여야 합니다.  
          매칭된 광고가 있으면 배너광고가 송출됩니다.(매칭된 광고가 없으면 배너광고가 비어있을 수 있습니다.)
          `,
      },
    ],
    obs: [
      {
        image: null,
        description: `${textStyling.styledBlock(`권장사항: Chrome(75 버전 이상)을 기본 브라우저로 사용하셔야 광고가 올바르게 송출됩니다.</br>크롬 버전 확인은 크롬 오른쪽 상단에 있는 아이콘 클릭 ${textStyling.styledText('도움말')} > ${textStyling.styledText('Chrome 정보')}를 눌러 확인 가능합니다.`)}`,
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-setBanner-01.png',
        description: `배너를 송출하기 위해 ${textStyling.LinkText('<대시보드>', 'main')}에서 배너 오버레이 URL의 ${textStyling.styledText('주소보기')}를 누르고 ${textStyling.styledText('복사')}를 눌려주세요.`,
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-setBanner-08.png',
        description: `OBS Studio를 실행시키 뒤,  
          하단에 있는 소스목록에서 ${textStyling.styledText('+')}버튼을 누른 후, ${textStyling.styledText('브라우저')}(BrowserSource)를 클릭합니다.${textStyling.styledBlock('(권장사항: OBS Studio 19 이상 사용을 권장합니다.)')}`,
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-setBanner-09.png',
        description: `${textStyling.styledText('새로 만들기')}를 클릭하여 ${textStyling.styledText('확인')}을 클릭합니다.  
          (어떤 소스인지 구분하려면 BrowserSource를 "온애드 배너"와 같이 원하는 이름으로 변경 후 확인 버튼을 클릭하면 됩니다.)`,
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-setBanner-10.png',
        description: `속성창이 뜨면
          URL에 복사해둔 오버레이 주소를 ${textStyling.styledText('Ctrl + V')}를 눌러서 붙여 넣습니다.  
          내 방송에 해상도가 1920 X 1080(1080p) 이상이면 너비를 320, 높이로 160 설정해주시고  
          내 방송의 해상도가 1280 X 720(720p)이면 너비를 214, 높이를 107으로 설정해줍니다.${textStyling.styledBlock(`내 방송의 해상도 확인은 우측아래 ${textStyling.styledText('설정')}의 ${textStyling.styledText('비디오')} 탭에서 확인할 수 있습니다.`)}
          `,
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-setBanner-11.png',
        description: `추가된 소스를 드래그하여 맨 뒤에 둡니다.  
          빨간 영역을 드래그하여 위치를 조절합니다.`,
      },
      {
        image: null,
        description: `배너 크기를 변경하고자 하는 경우에는  
          해당 배너소스를 삭제한 이후 다시 생성하여야 합니다.  
          매칭된 광고가 있으면 배너광고가 송출됩니다.(매칭된 광고가 없으면 배너광고가 비어있을 수 있습니다.)
          `,
      },
    ],
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
        description: `배너광고는 광고 송출 알고리즘에 따라 자동적으로 송출됩니다.  
        송출되고 있는 광고의 정보는 ${textStyling.LinkText('<대시보드>', 'main')}의 현재 송출중인 배너에서 확인할 수 있습니다.`,
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-income-01.png',
        description: `방송 중, 광고가 송출되면 수익금이 자동적으로 누적됩니다.  
        수익금은 송출 시간 및 시청 인원, 광고 레벨 등 여러 변수에 의해 결정됩니다.   
        누적되는 수익금은 ${textStyling.LinkText('<대시보드>', 'main')}에서 확인할 수 있습니다.`,
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-income-02.png',
        description: `송출되는 광고는 크리에이터님의 방송 채널 패널과 연동됩니다.   
        패널 클릭시 광고주/마케터 님이 연동한 URL 페이지로 이동합니다. 패널 및 채팅광고에 대한 시청자의 클릭(상호작용)에 대해 수익은 추가적으로 발생합니다.   
        또한, 시청자의 광고에 대한 클릭에 따라 크리에이터님의 광고 레벨도 상승합니다.   
        ${textStyling.LinkText('<내 클릭광고>', 'ad-dashboard')}에서 확인하세요!
        광고 단가 책정, 이벤트 및 광고 선정 우선순위에 가산점으로 작용할 수 있습니다.`
      },
    ],
  },
  landing: {
    subType: false,
    card: {
      title: '내 클릭광고 관리하기',
      subtitle: '패널광고와 채팅광고를 관리하고, 현황을 확인하세요'
    },
    source: [
      {
        image: null,
        description: `자신의 방송 채널에 패널을 게시하고 채팅 광고를 통해 더욱 많은 광고 수익을 얻어보세요.  
        시청자들의 상호작용에 의해 추가적 광고 수익이 발생할 수 있습니다.  
        `
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-landing-01.png',
        description: `자신의 트위치 방송채널에서, 패널 편집을 ${textStyling.styledText('ON')}으로 바꾼 후,  
        ${textStyling.styledText('텍스트나 이미지 패널 추가')}를 클릭하세요.`
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-landing-02.png',
        description: `자신만의 광고페이지 이동 배너를 업로드하거나,  
        ${textStyling.LinkText('<내 클릭광고>', 'ad-dashboard')}에서 기본이미지를 다운로드 받아 업로드하세요.  
        이미지 링크에는 자신의 ${textStyling.styledText('패널링크')} 주소를 입력하세요.
        `
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-chatbot-01.png',
        description: `채팅 광고를 하고 싶다면 채팅광고 ON/OFF를 설정해주세요.   
        온애드의 광고채팅봇 ${textStyling.styledText('onadyy')}는 주기적으로 현재 송출중인 배너광고에 대한 설명과 광고 링크를 채팅으로 자동홍보해줘요.   
        시청자가 ${textStyling.styledText('onadyy')}가 홍보한 링크를 클릭하면, 클릭에 대한 추가적인 광고 수익이 발생한답니다.
        `
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-landing-03.png',
        description: `${textStyling.LinkText('<대시보드>', 'landing')} 또는 ${textStyling.LinkText('<내 클릭광고>', 'ad-dashboard')}에서 현황을 확인할 수 있습니다.  
        `
      },
    ]
  },

  bannerlist: {
    subType: false,
    card: { title: '진행한 모든 배너를 확인', subtitle: '' },
    source: [
      {
        image: '/pngs/dashboard/manual/new_creator/creator-banner-01.png',
        description: `${textStyling.LinkText('<내 배너광고>', 'banner')}에서 지금까지 진행한 모든 배너광고와, 해당 배너광고의 정보, 
        해당 배너광고의 정보, 해당 배너광고로 인한 수익정보를 확인할 수 있습니다.`
      },
    ]
  },
  withdrawal: {
    card: { title: '수익금 출금', subtitle: '' },
    subType: false,
    source: [
      {
        image: '/pngs/dashboard/manual/new_creator/creator-withdrawal-01.png',
        description: `${textStyling.LinkText('<내 계정>', 'user')}으로 이동하여 정산 등록 신청서를 제출하세요.   
        정산 등록이 ${textStyling.styledText('승인완료')} 되어야만 출금 신청이 가능합니다.
        `,
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-withdrawal-02.png',
        description: `${textStyling.LinkText('<대시보드>', 'main')}에서 ${textStyling.styledText('출금신청')} 버튼을 클릭하여  
        출금 가능 금액 이하의 금액을 입력하여 신청할 수 있습니다.  
        최소 출금 가능 금액은 3만원입니다.  
        출금 신청된 금액은 신청한 달의 다음달 10일에 등록한 계좌로 정산됩니다.`,
      },
      {
        image: '/pngs/dashboard/manual/new_creator/creator-withdrawal-03.png',
        description: `출금신청 내역은 다음과 같이 확인 가능합니다.  
        입금이 완료된 내역은 ${textStyling.styledText('완료됨')} 으로 표시됩니다.  
        입금 진행 중인 내역은 ${textStyling.styledText('정산대기')}로 표시됩니다.`,
      },
    ],
  },
};

export default manualSources;
