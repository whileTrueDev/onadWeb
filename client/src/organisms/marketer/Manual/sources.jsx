import CloudUpload from '@material-ui/icons/CloudUpload';
import BrandingWatermark from '@material-ui/icons/BrandingWatermarkOutlined';
import InsertChart from '@material-ui/icons/InsertChart';
import AccountBox from '@material-ui/icons/AccountBox';
import Money from '@material-ui/icons/Money';

const HOST_URL = `${window.location.protocol}//${window.location.host}/dashboard/marketer`;
function colorize(string, color) {
  return `<span style="color:${color}">${string}</span>`;
}

const manualSources = {
  selectComponent: [
    {
      icon: CloudUpload,
      label: '배너 등록',
    },
    {
      icon: BrandingWatermark,
      label: '배너 광고 송출',
    },
    {
      icon: InsertChart,
      label: '광고 성과 확인',
    },
    {
      icon: Money,
      label: '광고 캐시 관리',
    },
    {
      icon: AccountBox,
      label: '세금계산서 발행'
    },
  ],
  bannerRegist: {
    card: {
      title: '광고배너 등록',
      subtitle: '크리에이터의 방송 및 광고페이지에 송출하고자 하는 광고를 등록하고 관리할 수 있습니다.',
    },
    source: [
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer-banner-01.png',
        description: `[**<내 배너>**](${HOST_URL}/inventory) 탭에서 "새 배너 등록" 버튼을 클릭하여,  
        규정에 맞는 배너를 업로드합니다.  
        **등록된 배너는 검수과정을 거쳐 승인/거절 됩니다.** (최대 7일 이내)`,
      },
      {
        image: null,
        description: `거절된 배너의 경우 거절 사유를 확인한 이후 삭제한 뒤,  
        규정에 알맞은 배너로 다시 업로드합니다.  
        배너 승인 및 거절에 대한 도움은 support@onad.io 에게 메일로 요청가능합니다.`
      },
      {
        image: null,
        description: `**배너의 송출은 캠페인을 생성한 이후에 가능합니다.**  
        승인된 배너의 경우 캠페인 생성시에 활용 가능합니다.
        캠페인 생성은 [**<대시보드>**](${HOST_URL}/main)에서 진행할 수 있습니다.`,
      },
    ],
  },
  campaignStart: {
    card: {
      title: '배너 광고 송출',
      subtitle: '승인된 배너를 송출하는 방법에 대한 설명입니다.',
    },
    source: [
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer-campaign-01.png',
        description: `광고 송출을 위해 < 캠페인 > 을 생성하여야 합니다.  
        캠페인은 [**<대시보드>**](${HOST_URL}/main)에서  
        "캠페인 생성하기"를 클릭하여 생성할 수 있습니다.`,
      },
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer-campaign-02.png',
        description: `검수과정를 통해 승인된 배너들 중 해당 캠페인에 사용할 배너를 선택,  
        광고 송출 우선순위, 광고 송출을 원하는 우선순위, 광고의 유형등을 선택하는 등,  
        필요한 사항을 입력하여 **캠페인 등록을 진행**합니다.`,
      },
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer-campaign-03.png',
        description: '등록된 **캠페인의 광고 송출 상태를 On/Off 버튼으로 제어할 수 있으며**,  ',
      },
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer-campaign-04.png',
        description: `대시보드 **좌측 상단**의 On/Off 버튼을 통해
        **광고주님의 광고상태를 On/Off 하여 등록된 모든 캠페인 송출을 제어할 수 있습니다**.  
        광고 캐시가 충분하며, 광고주의 광고상태 ON / 캠페인의 광고상태 ON 인 모든 광고는 송출할 준비가 되었고,  
        내부 광고 송출 알고리즘에 따라 자동적으로 송출됩니다.  `,
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
        image: '/pngs/dashboard/manual/new_marketer/marketer_costChart.PNG',
        description: `광고 비용에 대한 차트는 [**<대시보드 >**](${HOST_URL}/main)에서 확인할 수 있습니다.  
        `,
      },
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer_broadcastCreator.PNG',
        description: `또한 마케터님의 광고를 송출한 크리에이터를 [**<대시보드 >**](${HOST_URL}/main)의 <송출크리에이터>에서 확인할 수 있습니다.  
        `,
      },
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer-chart-01.png',
        description: `광고 효과보고서에 대한 차트는 [**<대시보드 >**](${HOST_URL}/main)의 <캠페인목록>을 클릭하면 광고효과 보고서 탭으로 이동하실 수 있습니다.`
      },
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer-chart-02.png',
        description: `캠페인 상태 및 광고비용 그래프, 광고비용 비율, 배너 송출 크리에이터,
        지역별, 날짜별 상호작용을 한 눈에 확인하실 수 있습니다.`
      }

    ],
  },
  cash: {
    card: {
      title: '광고 캐시 관리',
    },
    source: [
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer-taxbill-02.png',
        description: `[**<내 오피스>**](${HOST_URL}/myoffice) 에서 캐시를 충전하거나, 환불할 수 있습니다.  
        환불의 경우, 환불계좌 등록 이후 진행 가능합니다.`
      },
      {
        image: null,
        description: `[**<내 오피스>**](${HOST_URL}/myoffice) 에서 상세 캐시 소진내역을 확인할 수 있습니다.  
        상세 보기 클릭시, 해당 월의 세부 캐시 소진내역을 확인 할 수 있습니다.`
      }
    ]
  },
  business: {
    card: {
      title: '세금 계산서 발행',
      subtitle: '사업자 계정의 경우만 세금계산서가 발행됩니다.'
    },
    source: [
      {
        image: '',
        description: `세금계산서는  
        **발행 기준** : 당월 캐시 충전 금액의 총 합
        **발행 주기** : 익월 중, 월 1회 일괄 발행
        **발행 단위** : ${colorize('**사업자 등록증을 업로드한 사업자 계정에 한해**', 'red')}, 월 캐시 충전 금액의 총합에 대하여 한장의 세금계산서로 발행  
        의 기준에 따라, 회원가입시 입력한 메일로 전송`
      },
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer-taxbill-01.png',
        description: `사업자 등록증 업로드는 [**<내 오피스>**](${HOST_URL}/myoffice) --> **"내 정보 관리"**에서 진행 할 수 있습니다.  
        **사업자 등록증이 업로드 된 계정만 세금계산서가 발행됨을 유의하시기 바랍니다.**  `
      },
      {
        image: '/pngs/dashboard/manual/new_marketer/marketer-taxbill-02.png',
        description: `[**<내 오피스>**](${HOST_URL}/myoffice) 에서 상세 캐시 소진내역과 함께  
        해당 월의 세금계산서 발행 여부를 확인 할 수 있습니다.  
        이상 있거나, 지난 달의 세금계산서(수정 발행 포함)에 대한 수요가 있는 경우,  
        support@onad.io 로 메일을 보내주시기 바랍니다.  
        **수정발행, 지난 달의 세금계산서 발행 마감 주기**  
        - 1분기 : 1월 ~ 3월, 발행 마감: 4월 9일  
        - 2분기 : 4월 ~ 6월, 발행 마감: 7월 9일  
        - 3분기 : 7월 ~ 9월, 발행 마감: 10월 9일   
        - 4분기 : 10월 ~ 12월, 발행 마감: 1월 9일  
        `
      }
    ]
  }
};

export default manualSources;
