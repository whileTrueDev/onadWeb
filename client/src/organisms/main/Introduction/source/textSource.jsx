

const textSource = {
  heroSector: {
    marketer: {
      text: {
        title: '시청자 맞춤형 광고 서비스\n생방송으로 즐기는 배너광고\n원하는 대로 맞춤형 광고 서비스.',
      },
    },
    creator: {
      text: {
        title: '별다른 설정없이\n자동으로 송출되는 광고\n지속적인 추가수입을 창출하세요.'
      }
    },
    backImage: '/pngs/main/mainImage.jpg',
  },
  topSector: [
    {
      url: '/pngs/introduction/service_main_1.png',
      width: '50%',
      trigger: {
        threshold: 500,
        timeout: 500
      }
    },
    {
      url: '/pngs/introduction/service_main_2.png',
      width: '50%',
      trigger: {
        threshold: 500,
        timeout: 1000
      }
    },
    {
      url: '/pngs/introduction/service_main_3.png',
      width: '50%',
      trigger: {
        threshold: 800,
        timeout: 500
      }
    },
    {
      url: '/pngs/introduction/service_main_4.png',
      width: '50%',
      trigger: {
        threshold: 800,
        timeout: 1000
      }
    },
  ],
  creator: {
    firstSector: {
      image: 'pngs/introduction/serviceMain.png',
      head: '크리에이터 서비스소개',
      body: '크리에이터님의 실시간 방송에 배너광고를 넣으세요\n간단한 약관만 수락해주시면 바로 해보실 수 있습니다.\n방송에 광고를 띄우면 시청자 수와 방송시간에 비례해서\n돈을 지급받으실 수 있습니다.',
    },
    secondSector: {
      head: '이용안내',
      subTitle: '정말 쉬운 사용방법이 있습니다. 회원가입과 약관 동의 후에 URL을 복사해서 방송송출 프로그램에 적용만 해주시면 됩니다.',
      firstContent: '트위치 아이디로\n 쉽게 가입하실 수 있습니다',
      secondContent: '대시보드로 이동해서\n생성된 URL을 복사해주시면 됩니다',
      thirdContent: 'X-Split이나 OBS로 생성된 URL을\n 붙여놓으면 사용하실 수 있습니다',
      fourthContent: '방송 시간과 시청자 수에 비례한\n금액을 지급받습니다\n대시보드에서 확인하실 수 있습니다',
    },
  },
  marketer: {
    firstSector: {
      image: 'pngs/introduction/serviceMain.png',
      head: '마케터 서비스소개',
      body: '크리에이터의 실시간 방송에 광고를 등록하실 수 있습니다.\n배너를 이미지 형식으로 올려주시면 간단한 심사 후\n실시간 방송에 올라갑니다.',
    },
    secondSector: {
      head: '이용안내',
      subTitle: '간단한 가입 후 캠페인을 생성하세요. 광고는 자동으로 관련있는 방송에 송출됩니다. 광고비용은 시청자 수 데이터에 기반합니다.',
      firstContent: '회원가입과 몇 가지 약관을\n 동의해주세요',
      secondContent: '실시간 방송에 올라갈 배너를 등록해주세요',
      thirdContent: '지불한 서비스에 따라 실시간 방송에\n 배너가 송출됩니다.'
    },
  },

};

export default textSource;
