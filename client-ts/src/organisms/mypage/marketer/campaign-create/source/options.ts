import { OptionInterface } from '../interfaces';

const options: OptionInterface[] = [
  {
    id: 'option1',
    primaryText: '생방송 LIVE - 배너 광고 캠페인',
    secondaryText: '실시간 인터넷 방송 화면, 웹페이지, 채팅창까지 3가지 공간에 브랜드를 동시 노출할 수 있는\n온애드의 브랜딩 전용 상품입니다.',
    materials: [
      {
        name: '생방송 송출 배너',
        desc: '생방송 화면에 송출되는 배너로 실시간으로 집계되는 시청자수에 맞게 광고 비용이 정산됩니다.\n스트리머에 애정이 있는 시청자들은 배너에 대해 긍정적이며 관심을 갖는 경향이 있습니다.',
        images: [
          { desc: '모바일 화면', src: '/pngs/dashboard/ad_desc/모바일배너.png' },
          { desc: 'PC 화면', src: '/pngs/dashboard/ad_desc/피시배너.png' },
        ],
        billingType: 'CPM/T',
        lastDesc: '시청자 수 1명당 2원이 부과되며 시청자 수는 10분마다 시스템으로 자동 체킹됩니다.\n(클릭이 불가능한 방송화면 내의 배너입니다.)'
      },
      {
        name: '클릭 배너',
        desc: '방송화면 아래, 방송인의 프로필에 비치되어 클릭 시, 랜딩페이지로 이동할 수 있는 배너입니다.',
        images: [
          { desc: '모바일 화면 | 방송인 프로필에 위치하며 클릭 시 랜딩페이지로 이동합니다.', src: '/pngs/dashboard/ad_desc/모바일하단배너.png' },
          { desc: 'PC 화면 | 영상 하단에 위치하며 클릭 시 랜딩페이지로 이동합니다.', src: '/pngs/dashboard/ad_desc/피시하단배너.png' },
        ],
        billingType: 'eCPC',
        lastDesc: '배너 클릭당 100원이 부과됩니다.\n(검증된 유효 클릭 발생 시에만 과금됩니다.\n매크로 프로그램과 같은 비정상적 접속 또는 중복 IP 및 디바이스로 발생한 클릭은 무효로 처리됩니다.)'
      },
      {
        name: '챗봇',
        desc: '시청자들이 소통하는 채팅창에 홍보하고자 하는 랜딩페이지 URL이 주기적으로 등록됩니다.\n해당 링크URL을 클릭 시 랜딩페이지로 이동합니다.',
        images: [
          { desc: '모바일 화면', src: '/pngs/dashboard/ad_desc/모바일채팅봇.png' },
          { desc: 'PC 화면', src: '/pngs/dashboard/ad_desc/피시채팅봇.png' },
        ],
        billingType: 'eCPC',
        lastDesc: '링크 클릭당 100원이 부과됩니다.\n(검증된 유효 클릭 발생 시에만 과금됩니다.\n매크로 프로그램과 같은 비정상적 접속 또는 중복 IP 및 디바이스로 발생한 클릭은 무효로 처리됩니다.)'
      }
    ]
  },
  {
    id: 'option0',
    primaryText: '참여형 광고 캠페인(CPA only)',
    secondaryText: '추가 예정입니다.',
  },
  {
    id: 'option2',
    primaryText: '업로드형 광고 캠페인(유튜브)',
    secondaryText: '추가 예정입니다.',
  },
];

export default options;
