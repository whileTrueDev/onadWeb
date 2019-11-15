const sendTypeConfig = [
  {
    title: '크리에이터 우선형이란?',
    text: `  
    - 내가 선호하는 특정 크리에이터에게 우선적으로 광고를 송출합니다.
    - 광고를 넣고 싶은 크리에이터를 직접 선택할 수 있습니다.`
  },
  {
    title: '카테고리 우선형이란?',
    text: `  
    - 선택한 카테고리에 속한 크리에이터에게 우선적으로 광고를 송출합니다.
    - 게임/소통/음악 등 내 제품과 어울리는 카테고리에 광고를 송출할 수 있습니다.`
  },
  {
    title: '노출 우선형이란?',
    text: `  
    - 시청자 수가 많은 크리에이터에게 우선적으로 광고 송출합니다.
    - 단기 이벤트, 행사 공지 등 빠르고 많은 노출이 필요한 단기성 광고에 적합합니다.
    ⚠️ 노출을 많이 하는 만큼 광고 캐시가 빨리 소진될 수 있습니다.`
  },

];

const optionConfig = [
  {
    title: '배너 광고 옵션은?',
    text: `  
    - 배너 광고만 노출하고 노출량에 따라 CPM(1,000개 노출 당 비용)으로 과금됩니다.
    - 일일 예산을 등록하여 추가 과금이 발생하지 않도록 할 수 있습니다.
    `
  },
  {
    title: '배너 광고 + 랜딩 페이지 옵션은?',
    text: `  
    - 배너 광고 노출과 방송국 하단에 링크를 추가하여 구매 페이지로 넘어갈 수 있게되며 
     링크 클릭수에 따라 CPC(클릭당 비용)로 과금됩니다.
    - 보고서를 통해 광고 효과를 제공받습니다.`
  }
];

const budgetConfig = [
  {
    title: '캠페인의 일한도 예산을 설정할 수 있습니다.',
    text: `
    - 5,000원 ~ 1,000,000원 사이에서 10원 단위로 설정할 수 있습니다.
    ⚠️ 일 한도 예산을 초과할 경우, 광고 집행이 중지 됩니다.`
  }
];

const landingManageConfig = [
  {
    title: '소개글 이란?',
    text: `  
    - 소개글은 해당 광고페이지에서 자신을 소개 및 어필할 수 있는 글공간입니다.`,
    image: '/pngs/landing/description_sample.png'
  },
  {
    title: '광고페이지의 테마를 설정하세요',
    text: `  
    - 밝은 테마와 어두운 테마로 자신의 페이지를 설정할 수 있습니다.`,
  },
  {
    title: '광고 레벨 - 광고 유치점수 및 시청자 충성도',
    text: `
    - 레벨은 광고페이지에서의 유저의 지속적인 상호작용(조회, 클릭, 방문, 구매전환 등)에 의해 결정됩니다.
    - 광고레벨에 따라 광고 단가가 조정될 수 있으며, 광고주에게 우선 배정될 수 있는 등 혜택을 받을 수 있습니다.
    `
  },
  {
    title: '자신의 트위치 채널의 패널에 게시할 배너입니다.',
    text: `
    - 패널에 광고페이지 랜딩 배너를 부착하여 더 많은 시청자를 광고에 노출시키세요.
    - 아직 준비된 배너 이미지가 없으신가요? 기본 이미지를 활용하세요!
    - 이미지 클릭시 다운로드됩니다.`
  }
];

const reportConfig = [

  {
    title: 'CPM?',
    text: `  
    CPM은 방송화면에 노출되는 광고를 뜻합니다.
    - 노출 수 : 노출된 총 시청자 수
    - 노출 시간 : 노출된 총 시간 <반올림 된 값>`
  },
  {
    title: 'cpc',
    text: `
    CPC는 크리에이터들의 채널에서 클릭이 가능한 광고를 뜻합니다.
    - 배너 클릭 수 : 크리에이터의 채널에서 해당 광고를 클릭하여 정보를 조회한 횟수
    - 홈페이지 방문 수 : 크리에이터의 채널에서 해당 광고를 클릭한 후, 홈페이지까지 이동한 수
    `
  },
];
const reportCardConfig = [

  {
    title: '전환당 비용',
    text: `  
    - 비용을 전환수로 나눈 값으로 전환 1회의 평균 비용입니다.`
  },
  {
    title: '전환율',
    text: `
    - 홈페이지 방문 횟수를 배너 클릭 수로 나눈 값
    - 배너 클릭 시 홈페이지 방문으로 연결되는 평균 빈도를 보여줍니다.
    `
  },
  {
    title: '광고 노출 점유율',
    text: `
    - 실제 발생한 노출수를 예상 노출 수로 나눈 값`
  },
  {
    title: '상호 작용 발생율',
    text: `
    - 사용자가 광고를 본 후 광고와 상호작용하는 빈도를 나타냄`
  },
  {
    title: '상호작용 수',
    text: `
    - 광고 클릭, 광고 조회 등이 발생한 횟수`
  },
  {
    title: '리뷰 수',
    text: `
    - 제품을 구입한 사용자가 리뷰를 쓴 횟수`
  },
  {
    title: '스트리머 충성도',
    text: `
    - 리뷰 개수를 전환 횟수로 나눈 값`
  },
];

export {
  sendTypeConfig, optionConfig, budgetConfig, landingManageConfig, reportConfig, reportCardConfig
};
