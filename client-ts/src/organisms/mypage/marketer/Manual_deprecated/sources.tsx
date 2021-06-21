import CloudUpload from '@material-ui/icons/CloudUpload';
import BrandingWatermark from '@material-ui/icons/BrandingWatermarkOutlined';
import InsertChart from '@material-ui/icons/InsertChart';
import AccountBox from '@material-ui/icons/AccountBox';
import Money from '@material-ui/icons/Money';
import ArtTrack from '@material-ui/icons/ArtTrack';
import textStyling from '../../shared/textStyling';

const manualSources = {
  selectComponent: [
    {
      icon: CloudUpload,
      label: '온애드 광고 아이템',
      key: 'bannerRegist',
    },
    {
      icon: BrandingWatermark,
      label: '배너 업로드',
      key: 'bannerUpload',
    },
    {
      icon: ArtTrack,
      label: '캠페인 생성하기',
      key: 'campaignStart',
    },
    {
      icon: InsertChart,
      label: '광고 성과 확인',
      key: 'seeChart',
    },
    {
      icon: Money,
      label: '광고 캐시 관리',
      key: 'cash',
    },
    {
      icon: AccountBox,
      label: '세금계산서 및 현금영수증 발행',
      key: 'business',
    },
  ],
  bannerRegist: {
    card: {
      title: '등록 가능 배너',
      subtitle: '방송인의 방송 및 패널에 송출할 수 있는 배너를 소개합니다',
    },
    source: [
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer-banner-01.png',
        description: `광고와 관련된 아이템은 세가지 종류로, 다음과 같습니다.  
        번호 ${textStyling.styledTextSecondary('1')}의 ${textStyling.styledText(
          '방송 화면 송출 배너',
        )}는 방송 화면 내에 송출되는 배너입니다. (클릭 불가, 광고주의 배너 이미지)  
        번호 ${textStyling.styledTextSecondary('2')}의 ${textStyling.styledText(
          '패널 배너',
        )}는 클릭시 현재 방송 화면에 송출중인 배너광고와 연동된 URL로 이동합니다.(클릭 가능, 방송인이 설정한 이미지)  
        번호 ${textStyling.styledTextSecondary('3')}의 ${textStyling.styledText(
          '채팅창 광고 글귀',
        )}는 방송 채팅창에 주기적으로 송출되는 광고관련 글귀입니다.(광고주의 글귀)  
        `,
      },
    ],
  },
  bannerUpload: {
    card: {
      title: '배너 업로드',
      subtitle: '방송인의 방송 및 패널에 송출하고자 하는 광고를 등록하고 관리할 수 있습니다.',
    },
    source: [
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer-banner-02.png',
        description: `${textStyling.LinkText(
          '<내 배너>',
          'inventory',
          'marketer',
        )} 탭에서 ${textStyling.styledText('+ 새 배너 등록')} 버튼을 클릭하여,  
        규정에 맞는 배너를 업로드합니다.  
        등록된 배너는 검수과정을 거쳐 승인/거절 됩니다. (최대 1일 이내)`,
      },
      {
        image: null,
        description: `거절된 배너의 경우 거절 사유를 확인한 이후 삭제한 뒤,  
        규정에 알맞은 배너로 다시 업로드합니다.  
        배너 승인 및 거절에 대한 도움은 support@onad.io 에게 메일로 요청가능합니다.`,
        customButton: true,
      },
      {
        image: null,
        description: `배너의 송출은 캠페인을 생성한 이후에 가능합니다.  
        승인된 배너의 경우 캠페인 생성시에 활용 가능합니다.  
        캠페인 생성은 ${textStyling.LinkText(
          '<대시보드>',
          'main',
          'marketer',
        )}에서 진행할 수 있습니다.`,
      },
    ],
  },
  campaignStart: {
    card: {
      title: '캠페인 생성하기',
      subtitle: '승인된 배너를 통해 캠페인을 운용하는 방법에 대한 설명입니다.',
    },
    source: [
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer-campaign-01.png',
        description: `${textStyling.LinkText(
          '<대시보드>',
          'main',
          'marketer',
        )}에서 ${textStyling.styledText('캠페인 생성하기')} 버튼을 눌러주세요.`,
      },
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer-campaign-02.png',
        description: `희망하는 캠페인 광고 유형을 선택하고 ${textStyling.styledText(
          '다음',
        )}을 눌러주세요.
        `,
      },
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer-campaign-03.png',
        description: `원하는 송출 방식을 선택하고 ${textStyling.styledText(
          '다음',
        )}을 눌러주세요. ${textStyling.styledBlock(`- 특정 방송인에게만 광고 송출 : 원하는 방송인에게만 송출을 원하는 경우<br>
        - 특정 게임에만 광고 송출 : 특정 게임 시청자들을 타겟팅 하는 경우<br>
        - 업로드형 광고 캠페인(유투브) : 많은 시청자들에게 노출되는 것을 우선하는 경우(노출 수 가장 높음)`)}`,
      },
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer-campaign-04.png',
        description: `${textStyling.styledText(
          '배너',
        )}를 클릭하여 선택하고 이후 나오는 캠페인 생성 절차를 천천히 따라가 주세요. ${textStyling.styledBlock(
          '캠페인 이름을 두글자 이상 적어주세요.',
        )}`,
      },
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer-campaign-05.png',
        description: `클릭 시 이동하는 광고주님의 랜딩페이지 URL을 설정할 수 있습니다. ${textStyling.styledBlock(`URL 이름은 광고주님께서 URL의 식별 편리를 위한 이름입니다.</br>
        EX) URL 이름 : 네이버, URL주소 : www.naver.com`)}`,
      },
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer-campaign-06.png',
        description: `${textStyling.LinkText(
          '<대시보드>',
          'main',
          'marketer',
        )} 좌측 상단의 ${textStyling.styledText(
          'ON/OFF',
        )} 버튼을 통해 광고주님의 광고상태를 ${textStyling.styledText(
          'ON/OFF',
        )}하여 등록된 모든 캠페인 송출을 제어할 수 있습니다.`,
      },
      {
        image: null,
        description: `배너와 URL링크의 심의가 통과되고, ${textStyling.styledText(
          '광고 캐시',
        )}가 충분하며, 광고주의 광고 상태 ${textStyling.styledText(
          'ON',
        )}인 모든 광고는 송출할 준비가 되어서  
        내부 광고 송출 알고리즘에 따라 자동적으로 송출됩니다.${textStyling.styledBlock(
          `${textStyling.LinkText('> 광고 캐시 충전하러 가기', 'myoffice', 'marketer')}`,
        )}`,
      },
    ],
  },
  seeChart: {
    card: {
      title: '광고 성과 확인',
      subtitle: '광고집행에 대한 성과차트와 광고효과보고서를 볼 수 있습니다.',
    },
    source: [
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer-costChart-01.png',
        description: `광고 비용에 대한 차트는 ${textStyling.LinkText(
          '<대시보드>',
          'main',
          'marketer',
        )}에서 확인할 수 있습니다.  
        또한 광고주님의 광고를 송출한 방송인을 ${textStyling.LinkText(
          '<대시보드>',
          'main',
          'marketer',
        )}의 ${textStyling.styledText('송출방송인')}에서 확인할 수 있습니다.`,
      },
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer-costChart-02.png',
        description: `광고효과보고서에 대한 차트는 ${textStyling.LinkText(
          '<대시보드>',
          'main',
          'marketer',
        )}의 ${textStyling.styledText('캠페인목록')}의 ${textStyling.styledText(
          '분석',
        )}을 클릭하면 ${textStyling.styledText('캠페인 효과 분석')} 탭으로 이동하실 수 있습니다.`,
      },
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer-costChart-03.png',
        description:
          '캠페인 상태 및 광고비용 그래프, 광고비용 비율, 배너 송출 방송인, 날짜별, 지역별 유입 수를 한눈에 확인하실 수 있습니다.',
      },
    ],
  },
  cash: {
    card: {
      title: '광고 캐시 관리',
      subtitle: '',
    },
    source: [
      {
        image: null,
        description: `${textStyling.LinkText(
          '<내 오피스>',
          'myoffice',
          'marketer',
        )}에서 캐시를 충전하거나, 환불할 수 있습니다.  
        환불의 경우, 환불계좌 등록 이후 진행 가능합니다.`,
      },
      {
        image: null,
        description: `${textStyling.LinkText(
          '<내 오피스>',
          'myoffice',
          'marketer',
        )}에서 상세 캐시 소진 내역을 확인할 수 있습니다.  
        상세 보기 클릭 시, 해당 월의 세부 캐시 소진 내역을 확인할 수 있습니다.`,
      },
    ],
  },
  business: {
    card: {
      title: '세금 계산서 및 현금영수증발행',
      subtitle:
        '사업자 계정의 경우만 세금계산서가 발행되지만 현금영수증은 누구든 발행 요청이 가능합니다.',
    },
    source: [
      {
        image: null,
        description: `세금계산서는 및 현금영수증은 
        발행 기준 : 캐시 충전 완료 시 발행  
        발행 주기 : 세금계산서는 당월 말일, 월 1회 일괄 발행 / 현금영수증의 경우 충전 당일을 원칙으로 합니다.  
        발행 단위 : ${textStyling.styledText('사업자등록증')}을 업로드한 사업자 계정 대상으로,  
        캐시 충전 시 마다 한 장의 세금계산서로 발행 기준에 따라, 회원가입 시 입력한 메일로 전송. ${textStyling.styledBlock(`단, 신용카드 결제의 경우 세금계산서 발행불가.  
        현금영수증은 전자결제 과정에서 입력 혹은 별도로 요청시 ${textStyling.LinkText(
          '<내 오피스>',
          'myoffice',
          'marketer',
        )}발행할 번호를 입력바랍니다.`)}`,
      },
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer-taxbill-01.png',
        description: `사업자 등록증 업로드 및 현금영수증 번호 입력은 ${textStyling.LinkText(
          '<내 오피스>',
          'myoffice',
          'marketer',
        )}에서 세금계산서/현금영수증 발행의 ${textStyling.styledText(
          '발행진행',
        )}을 클릭하여 진행할 수 있습니다.${textStyling.styledBlock(
          '사업자 등록증이 업로드 혹은 현금영수증 발행 번호가 입력된 계정만 발행됨을 유의하시기 바랍니다.',
        )}`,
      },
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer-taxbill-02.png',
        description: `${textStyling.LinkText(
          '<내 오피스>',
          'myoffice',
          'marketer',
        )}에서 ${textStyling.styledText(
          '세금계산서 관리',
        )}에서 세금계산서 발행 내역을 확인할 수 있습니다.  
        이상 있거나, 지난달의 세금계산서(수정 발행 포함)에 대한 수요가 있는 경우,  
        support@onad.io로 메일을 보내주시기 바랍니다.  
        수정 발행, 지난달의 세금계간서 발행 마감 주기  
        - 1분기 : 1월 ~ 3월, 발행 마감 : 4월 9일  
        - 2분기 : 4월 ~ 6월, 발행 마감 : 7월 9일  
        - 3분기 : 7월 ~ 9월, 발행 마감 : 10월 9일  
        - 4분기 : 10월 ~ 12월, 발행 마감 : 1월 9일`,
      },
    ],
  },
};

export default manualSources;
